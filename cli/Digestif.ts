import { CommandLineParser } from "@microsoft/ts-command-line";
import { ImportAction } from "./ImportAction";
import { RenderAction } from "./RenderAction";

export class DigestifCommandLine extends CommandLineParser {
  public constructor() {
    super({
      toolDescription: "The digestif site tools.",
      toolFilename: "dp"
    });
    this.addAction(new ImportAction());
    this.addAction(new RenderAction());
  }

  protected onDefineParameters(): void {
    // abstract
  }

  protected onExecute(): Promise<void> {
    // override
    return super.onExecute();
  }
}
