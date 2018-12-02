import * as express from 'express';
import * as next from 'next';
import * as digestif from './digestif';
import { DataImport } from '../operations/DataImport';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express()

  server.get('/digest/:id', (req, res) => {
    digestif.getDigest(req.params.id).then(items => (app.render(req, res, '/digest', { preloaded: items })));
  });

  server.get('/flickr', (_, res) => {
    DataImport.importAll(DataImport.createMongoClient(), true).then(result => res.send(result)).catch((err) => res.send({error:err}));
  });

  // Fall-back on other next.js assets.
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err: any) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000')
  });
})
