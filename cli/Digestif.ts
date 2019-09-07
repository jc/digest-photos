import { CommandLineParser } from '@microsoft/ts-command-line';
import { ImportAction } from './ImportAction';

export class DigestifCommandLine extends CommandLineParser {
  public constructor() {
    super({
      toolFilename: 'dp',
      toolDescription: 'The digestif site tools.',
    });
    this.addAction(new ImportAction());
  }

  protected onDefineParameters(): void { // abstract
  }

  protected onExecute(): Promise<void> { // override
    return super.onExecute();
  }
}
