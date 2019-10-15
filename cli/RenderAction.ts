import {CommandLineAction, CommandLineFlagParameter} from '@microsoft/ts-command-line';
import { DataImport } from '../operations/DataImport';
import { DigestEmail } from '../components/email/DigestEmail';
import {render} from 'mjml-react';
import { IdHelper } from '../operations/IdHelper';
import { MailgunDelivery } from '../operations/MailgunDelivery';

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
  
  async getItems() {
    const mongoClient = DataImport.createMongoClient();
    await mongoClient.connect();
    const db = await mongoClient.db("digestif");
    const itemsCollection = db.collection("items");
    const digestCollection = db.collection("digests");
    const digestFilter = {legacy_id: 'Rabn'};
    const digest = await digestCollection.findOne(digestFilter);
    const serviceKey = digest.service_key;
    const filter =  { service_key: serviceKey, 
      date_uploaded: {$gt: digest.start_date, $lt: digest.end_date}
    };
    const sort = {date_taken: 1};
    const items = await itemsCollection.find(filter).sort(sort).toArray();
    mongoClient.close();
    const url = `https://digest.photos/v/${serviceKey}/${IdHelper.encode(digest.start_date.getTime(), digest.end_date.getTime())}`
    return {items: items, url: url};
  }

  protected async onExecute(): Promise<void> {
    const result = await this.getItems();
    const output = render(DigestEmail.generate(result.items, result.url), {validationLevel: 'soft'});
    if (this.dryRun.value) {
      console.log(output.html);
    } else {
      MailgunDelivery.send(output.html);
    }
  }
}