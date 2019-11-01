import {CommandLineAction, CommandLineFlagParameter} from '@microsoft/ts-command-line';
import { DataImport } from '../operations/DataImport';
import { Email } from '../components/email/DigestEmail';
import {render} from 'mjml-react';
import { IdHelper } from '../operations/IdHelper';
import { MailgunDelivery } from '../operations/MailgunDelivery';
import React from "react";
import { DigestManager } from '../operations/DigestManager';
import { DigestProps, SubscriptionProps, StreamProps } from '../components/Models';

export class RenderAction extends CommandLineAction {
  private dryRun: CommandLineFlagParameter;

  public constructor() {
    super({
      actionName: 'render',
      summary: 'Render digest into email',
      documentation: 'Renders a fixed digest'
    });
  }
  
  protected onDefineParameters(): void {
      this.dryRun = this.defineFlagParameter({
        parameterLongName: '--dry-run',
        parameterShortName: '-d',
        description: 'Dry run, do not hurt anyone'
      });
  }  
  
  async getItems(digest: DigestProps, db) {
    const itemsCollection = db.collection("items");
    const filter =  { service_key: digest.service_key,
      date_fetched: {$gt: digest.start_date, $lt: digest.end_date}
    };
    const sort = {date_taken: 1};
    const items = await itemsCollection.find(filter).sort(sort).toArray();
    const url = `https://digest.photos/v/${digest.service_key}/${IdHelper.encode(digest.start_date.getTime(), digest.end_date.getTime())}`
    return {items: items, url: url};    
  }

  async getSubscription(digest: DigestProps, db) {
    const subscriptionCollection = db.collection("subscriptions");
    const filter =  { service_key: digest.service_key,
                      email: digest.email };
    const subscription = await subscriptionCollection.findOne(filter) as SubscriptionProps;
    return subscription;
  }

  async performSend(digest: DigestProps, manager: DigestManager, stream, db) {
    try {
      const subscription = await this.getSubscription(digest, db);
      const result = await this.getItems(digest, db);
      const email = React.createElement(Email, {items: result.items, url: result.url, stream: stream, subscription: subscription});
      const output = render(email, {validationLevel: 'soft'});
      if (this.dryRun.value) {
        console.log(`[DRY-RUN]: Send ${digest.email} ${result.url} ${digest.end_date}`);
      } else {
        const sendResult = await MailgunDelivery.send(digest.email, output.html);
        await manager.completeDigest(digest);
        console.log(`Send ${digest.email} ${result.url}`, sendResult);
      }
      return digest;
    } catch (e) {
      if (e instanceof Error) {
        console.error(`Failed to send ${digest.email}:`, e);
      } else {
        console.error(`Failed to send ${digest.email}:`, e);
      }
      return null;
    }
  }

  async processStream(stream: StreamProps, db) {
    const manager = new  DigestManager(stream, db, true);
    const digests = (await manager.createDigests(new Date()));
    const sentDigests = (await Promise.all(digests.map((digest) => this.performSend(digest, manager, stream, db)))).filter((value) => value != null);
    let insertedCount = sentDigests.length;
    let logPrefix = '';
    if (!this.dryRun.value) {
      insertedCount = await manager.recordDigests(sentDigests);
    } else {
      logPrefix = '[DRY-RUN]:';
    }
    console.log(logPrefix, `${stream.service_key} generated ${digests.length} digests, sent ${sentDigests.length}, recorded ${insertedCount}`);
  }

  protected async onExecute(): Promise<void> {
    try {
      const mongoClient = DataImport.createMongoClient();
      await mongoClient.connect();
      const db = await mongoClient.db("digestif");
      const streamsCursor = await db.collection('streams').find({});
      while (await streamsCursor.hasNext()) {
        const stream = await streamsCursor.next() as StreamProps;
        await this.processStream(stream, db);
      }
      mongoClient.close();
    } catch (e) {
      console.error('Failed:', e);
    }
  }

}