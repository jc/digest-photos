import {DigestifCommandLine} from './Digestif';
import * as colors from 'colors';

const cmd = new DigestifCommandLine();
cmd.execute().catch((error) => {
  console.error(colors.red(`An unexpected error occurred: ${error}`));
  process.exit(1);
});