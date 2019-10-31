import { StreamProps, SubscriptionProps, DigestProps } from '../components/Models';
import memorize from 'memorize-decorator';

export class DigestManager {
  static DAY_IN_MS = 86400000;

  stream: StreamProps;
  db: any;
  dryRun: boolean;
  cache: {[date: string]: boolean;};

  constructor(stream: StreamProps, db: any, dryRun: boolean = false) {
    this.stream = stream;
    this.db = db;
    this.dryRun = dryRun;
  }

  async createDigests(processDate:Date): Promise<DigestProps[]> {
    const subscriptionsCollection = this.db.collection('subscriptions');
    const filter = {service_key: this.stream.service_key};
    const cursor = subscriptionsCollection.find(filter);
    const results: DigestProps[] = [];
    while (await cursor.hasNext()) {
      const subscription = await cursor.next() as SubscriptionProps;
      const lastDigest = subscription.last_digest;
      const modifiedLastDigest = lastDigest === undefined ? undefined : new Date(lastDigest.getTime() + 25 * 60 * 1000);
      if (this.readyForDigest(subscription.frequency, processDate, modifiedLastDigest)) {
        const contentAvailable = await this.hasContent(processDate, modifiedLastDigest);
        if (contentAvailable) {
          const digest: DigestProps = { service_key: subscription.service_key,
                                        email: subscription.email,
                                        start_date: modifiedLastDigest,
                                        end_date: processDate
                                      };
          results.push(digest);
        }
      }
    }
    return results;
  }

  async completeDigest(digest: DigestProps) {
    const subscriptionsCollection = this.db.collection('subscriptions');
    const result = await subscriptionsCollection.updateOne(
      {service_key:digest.service_key, email:digest.email},
      {$set: {last_digest: digest.end_date}});
    return result.modifiedCount == 1;
  }

  async recordDigests(digests: DigestProps[]): Promise<number> {
    if (digests.length == 0) {
      return 0;
    }
    const digestsCollection = this.db.collection('digests');
    const result = await digestsCollection.insertMany(digests);
    return result.insertedCount;
  }

  readyForDigest(frequency: number, processDate: Date, lastDate: Date): boolean {
    if (frequency == 0) {
      return false;
    }
    if (lastDate === undefined) {
      return true;
    }
    const delta = processDate.getTime() - lastDate.getTime();
    return delta / DigestManager.DAY_IN_MS >= frequency;
  }

  @memorize({ttl: Infinity})
  async hasContent(processDate: Date, lastDate: Date): Promise<boolean> {
    const filter =  {service_key: this.stream.service_key,  date_uploaded: {$gt: lastDate, $lt: processDate}};
    const itemsCollection = this.db.collection("items");
    const count = await itemsCollection.countDocuments(filter);
    return count > 0;
  }
}