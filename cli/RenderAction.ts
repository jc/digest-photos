import {CommandLineAction, CommandLineFlagParameter} from '@microsoft/ts-command-line';
import { DataImport } from '../operations/DataImport';
import { Email } from '../components/email/DigestEmail';
import {render} from 'mjml-react';
import { IdHelper } from '../operations/IdHelper';
import { MailgunDelivery } from '../operations/MailgunDelivery';
import React from "react";
import { DigestManager } from '../operations/DigestManager';
import { DigestProps } from '../components/Models';

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

  protected async onExecute(): Promise<void> {
    const mongoClient = DataImport.createMongoClient();
    await mongoClient.connect();
    const db = await mongoClient.db("digestif");
    const stream = await db.collection('streams').findOne({service_key: '35237094740@N01'});
    const manager = new  DigestManager(stream, db, true);
    const digests = await manager.createDigests(new Date());
    const sends = digests.map(async (digest) => {
      const result = await this.getItems(digest, db);
      const email = React.createElement(Email, {items: result.items, url: result.url, stream: stream, subscription: null});
      const output = render(email, {validationLevel: 'soft'});
      if (this.dryRun.value) {
        console.log(`[DRY-RUN]: Send ${digest.email} ${result.url} ${digest.end_date}`);
      } else {
        MailgunDelivery.send(output.html);
        manager.completeDigest(digest);
      }
    });
    await Promise.all(sends);
    let insertedCount = digests.length;
    if (!this.dryRun.value) {
      insertedCount = await manager.recordDigests(digests);
    }
    console.log(`${stream.service_key} generated ${digests.length} digests, recorded ${insertedCount}`);
    mongoClient.close();
  }
}