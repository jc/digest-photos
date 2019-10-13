import {NextApiRequest, NextApiResponse} from "next";
import { DataImport } from '../../../../operations/DataImport';
import * as mongodb from 'mongodb';
import { IdHelper } from '../../../../operations/IdHelper';

let cachedDb: mongodb.Db = null

async function getDb(): mongodb.Db {
  if (cachedDb == null) {
    const mongoClient = DataImport.createMongoClient();
    await mongoClient.connect();
    const db = await mongoClient.db("digestif");
    cachedDb = db;
  }
  return cachedDb;
}

async function retrieveItems(request: NextApiRequest, response: NextApiResponse) {
  const db = await getDb();
  const itemsCollection = db.collection("items");
  const { stream_id: serviceKey,
          digest_id: digestId } = request.query;
  const [startMs, endMs] = IdHelper.decode(digestId as string);
  const startDate = new Date(Number(startMs));
  const endDate = new Date(Number(endMs));
  const filter =  { service_key: serviceKey, 
    date_uploaded: {$gt: startDate, $lt: endDate}
   };
   const sort = {date_taken: 1};
   const items = await itemsCollection.find(filter).sort(sort).toArray();
   response.status(200).json({items: items});
}

export default retrieveItems;