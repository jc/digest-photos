import * as mongodb from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { DataImport } from "../../operations/DataImport";

export interface Subscription {
  service_key: string;
  frequency: number;
  email: string;
}

let cachedDb: mongodb.Db = null;

async function getDb(): mongodb.Db {
  if (cachedDb == null) {
    const mongoClient = DataImport.createMongoClient();
    await mongoClient.connect();
    const db = await mongoClient.db("digestif");
    cachedDb = db;
  }
  return cachedDb;
}

async function updateSubscription(db, subscription: Subscription) {
  const streamCollection = db.collection("streams");
  const stream = await streamCollection.findOne({
    service_key: subscription.service_key
  });
  if (stream == null || stream === undefined) {
    return false;
  }
  const subscriptionsCollection = db.collection("subscriptions");
  const result = await subscriptionsCollection.updateOne(
    { service_key: subscription.service_key, email: subscription.email },
    { $set: { frequency: subscription.frequency } },
    { upsert: true }
  );
  return result.modifiedCount === 1 || result.upsertedCount === 1;
}

async function adjustSubscription(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const subscription = request.body as Subscription;
  const db = await getDb();
  const result = await updateSubscription(db, subscription);
  response.status(200).json({ success: result });
}

export default adjustSubscription;
