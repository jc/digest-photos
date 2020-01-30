import {
  CommandLineAction,
  CommandLineFlagParameter
} from "@microsoft/ts-command-line";
import pino from "pino";
import { DataImport } from "../operations/DataImport";

export class ImportAction extends CommandLineAction {
  private dryRun: CommandLineFlagParameter;

  public constructor() {
    super({
      actionName: "import",
      summary: "Import all data from Flickr",
      documentation: "Imports all latest data from Flickr."
    });
  }

  protected onDefineParameters(): void {
    this.dryRun = this.defineFlagParameter({
      parameterLongName: "--dry-run",
      parameterShortName: "-d",
      description: "Dry run, do not store any data"
    });
  }

  protected async onExecute() {
    const logger = pino({ name: "cli-import" });
    let mongo = null;
    try {
      mongo = DataImport.createMongoClient();
      const result = await DataImport.importAll(mongo, this.dryRun.value);
      let updateMsg = "Update";
      if (this.dryRun.value) {
        updateMsg = "[DRY-RUN] Update";
      }
      for (const key of Object.keys(result)) {
        logger.info(updateMsg, key, "has", result[key], "items.");
      }
    } catch (e) {
      logger.error(e);
      if (mongo != null && mongo.isConnected()) {
        await mongo.close();
      }
    }
  }
}
