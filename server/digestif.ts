import { Stitch, AnonymousCredential } from 'mongodb-stitch-server-sdk';

export async function getDigest(legacy_id: string) {
  const client = Stitch.hasAppClient("digestif-qdsft") ?
    Stitch.defaultAppClient :
    Stitch.initializeDefaultAppClient("digestif-qdsft");
  await client.auth.loginWithCredential(new AnonymousCredential());
  const items = await client.callFunction("digestContents", [legacy_id]);
  return items;
}
