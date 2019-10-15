import {CommandLineAction, CommandLineFlagParameter} from '@microsoft/ts-command-line';
import { DataImport } from '../operations/DataImport';
import { DigestEmail } from '../components/email/DigestEmail';
import {render} from 'mjml-react';
import { IdHelper } from '../operations/IdHelper';

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
    console.log(this.dryRun);
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

  protected onExecute(): Promise<void> {
    return this.getItems().then((result) => console.log(render(DigestEmail.generate(result.items, result.url), {validationLevel: 'soft'})));
  }
}