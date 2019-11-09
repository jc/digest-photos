import {
  CommandLineAction,
  CommandLineFlagParameter
} from "@microsoft/ts-command-line";
import { render } from "mjml-react";
import pino from "pino";
import React from "react";
import { Email } from "../components/email/DigestEmail";
import {
  DigestProps,
  StreamProps,
  SubscriptionProps
} from "../components/Models";
import { DataImport } from "../operations/DataImport";
import { DigestManager } from "../operations/DigestManager";
import { IdHelper } from "../operations/IdHelper";
import { MailgunDelivery } from "../operations/MailgunDelivery";

export class RenderAction extends CommandLineAction {
  private dryRun: CommandLineFlagParameter;
  private logger = pino({ name: "cli-render" });

  public constructor() {
    super({
      actionName: "render",
      summary: "Render digest into email",
      documentation: "Renders a fixed digest"
    });
  }

  public async getItems(digest: DigestProps, db) {
    const itemsCollection = db.collection("items");
    const filter = {
      date_fetched: { $gt: digest.start_date, $lt: digest.end_date },
      service_key: digest.service_key
    };
    const sort = { date_taken: 1 };
    const items = await itemsCollection
      .find(filter)
      .sort(sort)
      .toArray();
    const url = `https://digest.photos/v/${
      digest.service_key
    }/${IdHelper.encode(
      digest.start_date.getTime(),
      digest.end_date.getTime()
    )}`;
    return { items, url };
  }

  public async getSubscription(digest: DigestProps, db) {
    const subscriptionCollection = db.collection("subscriptions");
    const filter = { service_key: digest.service_key, email: digest.email };
    const subscription = (await subscriptionCollection.findOne(
      filter
    )) as SubscriptionProps;
    return subscription;
  }

  public async performSend(
    digest: DigestProps,
    manager: DigestManager,
    stream,
    db
  ) {
    try {
      const subscription = await this.getSubscription(digest, db);
      const result = await this.getItems(digest, db);
      const email = React.createElement(Email, {
        items: result.items,
        url: result.url,
        stream,
        subscription
      });
      const output = render(email, { validationLevel: "soft" });
      if (this.dryRun.value) {
        this.logger.info(
          `[DRY-RUN]: Send ${digest.email} ${result.url} ${digest.end_date}`
        );
      } else {
        const sendResult = await MailgunDelivery.send(
          digest.email,
          output.html
        );
        await manager.completeDigest(digest);
        this.logger.info(`Send ${digest.email} ${result.url}`, sendResult);
      }
      return digest;
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error(`Failed to send ${digest.email}:`, e);
      } else {
        this.logger.error(`Failed to send ${digest.email}:`, e);
      }
      return null;
    }
  }

  public async processStream(stream: StreamProps, db) {
    const manager = new DigestManager(stream, db, true);
    const digests = await manager.createDigests(new Date());
    const sentDigests = (await Promise.all(
      digests.map(digest => this.performSend(digest, manager, stream, db))
    )).filter(value => value != null);
    let insertedCount = sentDigests.length;
    let logPrefix = "";
    if (!this.dryRun.value) {
      insertedCount = await manager.recordDigests(sentDigests);
    } else {
      logPrefix = "[DRY-RUN]:";
    }
    this.logger.info(
      logPrefix,
      `${stream.service_key} generated ${digests.length} digests, sent ${sentDigests.length}, recorded ${insertedCount}`
    );
  }

  protected onDefineParameters(): void {
    this.dryRun = this.defineFlagParameter({
      parameterLongName: "--dry-run",
      parameterShortName: "-d",
      description: "Dry run, do not hurt anyone"
    });
  }

  protected async onExecute(): Promise<void> {
    try {
      const mongoClient = DataImport.createMongoClient();
      await mongoClient.connect();
      const db = await mongoClient.db("digestif");
      const streamsCursor = await db.collection("streams").find({});
      while (await streamsCursor.hasNext()) {
        const stream = (await streamsCursor.next()) as StreamProps;
        await this.processStream(stream, db);
      }
      mongoClient.close();
    } catch (e) {
      this.logger.error("Failed:", e);
    }
  }
}
