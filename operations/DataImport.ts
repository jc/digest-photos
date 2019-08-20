import * as Flickr from 'flickr-sdk';
import * as mongodb from 'mongodb';

interface Stream {
  service_key: string,
  oauth_token: string,
  oauth_token_secret: string,
  service: string,
  last_checked: Date,
  created: Date,
  email: string
}

interface FlickrApiPhoto {
  id: string,
  owner: string,
  secret: string,
  server: string,
  farm: number,
  title: string,
  ispublic: number,
  isfriend: number,
  isfamily: number,
  description: { _content: string },
  dateupload: number,
  datetaken: string,
  tags: string,
  media: string,
  url_h: string,
  url_k: string
}

interface FlickrPhoto {
  service: string,
  service_key: string,
  item_key: string,
  date_uploaded: Date,
  date_taken: Date,
  date_fetched: Date,
  farm: number,
  server: string,
  secret: string,
  type: string,
  title: string,
  description: string,
  url_h: string,
  url_k: string
}

export class DataImport {
  stream: Stream;
  mongo: mongodb.MongoClient;
  dryRun: boolean;

  constructor(stream: Stream, mongo: mongodb.MongoClient, dryRun: boolean = false) {
    this.stream = stream;
    this.mongo = mongo;
    this.dryRun = dryRun;
  }

  async import(since: Date = this.stream.last_checked, collection = this.mongo.db("digestif").collection("items")) {
    console.log(since);
    const photos = await this.getFlickrPhotos(since);
    if (!this.dryRun) {
      const result = await collection.insertMany(photos);
      return result.insertedCount;
    } else {
      return photos.length;
    }
  }

  async getFlickrPhotos(since: Date) {
    const apiKey = process.env.FLICKR_API_KEY;
    const apiSecret = process.env.FLICKR_API_SECRET;
    const flickr = new Flickr(Flickr.OAuth.createPlugin(
      apiKey,
      apiSecret,
      this.stream.oauth_token,
      this.stream.oauth_token_secret));
    const query: { user_id: string, extras: string, min_upload_date: number, page?: number } = {
      user_id: this.stream.service_key,
      extras: "date_upload, date_taken, description, media, tags, url_h, url_k",
      min_upload_date: Math.floor(since.getTime() / 1000)
    }
    console.log(query);
    const photos: FlickrPhoto[] = [];
    let data: any = {};
    // Flickr API doesn't provide any sorting options for getPhotos. Load all photos into memory before writing
    // out to mongo
    do {
      data = (await flickr.people.getPhotos(query)).body;
      const pagePhotos = (data.photos.photo as [any])
        .filter(photo => this.keepPhoto(photo))
        .map((photo) => this.transform(photo));
      photos.push(...pagePhotos);
      query.page = data.page + 1;
    } while (data.stat === 'ok' && data.pages <= data.page)
    return photos;
  }

  keepPhoto(photo: FlickrApiPhoto): boolean {
    const visible = photo.ispublic == 1 || photo.isfamily == 1 || photo.isfriend == 0;
    const ignoreTag = photo.tags.indexOf("digestif:ignore=true") != -1;
    return visible && !ignoreTag;
  }

  transform(photo: FlickrApiPhoto): FlickrPhoto {
    return {
      service: "flickr",
      service_key: photo.owner,
      item_key: photo.id,
      date_uploaded: new Date(Number(photo.dateupload) * 1000),
      date_taken: new Date(photo.datetaken),
      date_fetched: new Date(),
      farm: photo.farm,
      server: photo.server,
      secret: photo.secret,
      type: photo.media,
      title: photo.title,
      description: photo.description._content,
      url_h: photo.url_h,
      url_k: photo.url_k
    }
  }

  static async importAll(mongo = this.createMongoClient(), dryRun: boolean = false) {
    await mongo.connect();
    const streams = mongo.db("digestif").collection("streams");
    const cursor = streams.find({});
    const results: {} = {};
    while (await cursor.hasNext()) {
      const stream = await cursor.next() as Stream;
      if (stream.service === "flickr") {
        const data = await new DataImport(stream, mongo, dryRun).import();
        results[stream.service_key] = data;
      }
    }
    mongo.close();
    return results;
  }

  static createMongoClient() {
    const user = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    const server = process.env.MONGO_SERVER;
    const uri: string = `mongodb+srv://${user}:${password}@${server}/test?retryWrites=true`;
    const mongo = new mongodb.MongoClient(uri, { useNewUrlParser: true });
    return mongo;
  }
}
