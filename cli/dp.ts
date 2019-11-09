import pino from "pino";
import { DigestifCommandLine } from "./Digestif";

const cmd = new DigestifCommandLine();
const logger = pino({ name: "cli-dp" });

cmd.execute().catch(error => {
  logger.error(`An unexpected error occurred: ${error}`);
  process.exit(1);
});
