import { Photograph } from '../../components/Photograph';
import { Layout } from '../../components/Layout';
import { FlickrImage } from '../../components/FlickrImage';
import { Component } from 'react';
import { NextPageContext } from 'next';
import * as os from 'os';
import { FlickrPhotoProps } from 'components/Models';
import React from "react";

interface DigestProps {
  items: FlickrPhotoProps[],
  error?: string
}

class Digest extends Component<DigestProps> {
  static async getInitialProps(context: NextPageContext) {
    let mongodb = undefined;
    if (context.req !== undefined) {
      mongodb = await import('mongodb-stitch-server-sdk');
      context.res.setHeader('Cache-Control', 's-maxage=15552000, stale-while-revalidate, max-age=0')
    } else {
      mongodb = await import('mongodb-stitch-browser-sdk');
    }
    const stitchConfig = new mongodb.StitchAppClientConfiguration.Builder().withDataDirectory(os.tmpdir()).build();
    const client = mongodb.Stitch.hasAppClient("digestif-qdsft") ?
      mongodb.Stitch.defaultAppClient :
      mongodb.Stitch.initializeDefaultAppClient("digestif-qdsft", stitchConfig);
    await client.auth.loginWithCredential(new mongodb.AnonymousCredential());
    const digest = context.query.id;
    const items = await client.callFunction("digestContents", [digest]);
    return items;
  }

  render() {
    return (
      <div>
        <Layout title="Digest">
          {this.props.items.map((item) => (
            <Photograph
              key={item.item_key}
              link={`https://www.flickr.com/photos/${item.service_key}/${item.item_key}`}
              description={item.description}
              title={item.title}>
              <FlickrImage {...item} />
            </Photograph>
          ))}
        </Layout>
      </div>
    );
  }
}

export default Digest;
