import {CommandLineAction, CommandLineFlagParameter} from '@microsoft/ts-command-line';
import { DataImport } from '../operations/DataImport';

export class ImportAction extends CommandLineAction {
  private dryRun: CommandLineFlagParameter;

  public constructor() {
    super({
      actionName: 'import',
      summary: 'Import all data from Flickr',
      documentation: 'Imports all latest data from Flickr.'
    });
  }
  
  protected onDefineParameters(): void {
      this.dryRun = this.defineFlagParameter({
        parameterLongName: '--dry-run',
        parameterShortName: '-d',
        description: 'Dry run, do not store any data'
      });
  }  
  
  protected onExecute(): Promise<void> {
    console.log("import called with " + this.dryRun.value)
    return DataImport.importAll(DataImport.createMongoClient(), this.dryRun.value).then(result => console.log(result)).catch((err) => console.log({ error: err }));
  }
}