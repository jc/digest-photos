import { Photograph } from '../../../components/Photograph';
import { Layout } from '../../../components/Layout';
import { FlickrImage } from '../../../components/FlickrImage';
import { NextPageContext } from 'next';
import { Component } from 'react';
import fetch from 'isomorphic-unfetch';

interface DigestProps {
  items: any,
  error?: string
}

class Digest extends Component<DigestProps> {
  static async getInitialProps(context: NextPageContext) {
    const { stream_id: serviceKey,
      digest_id: digestId } = context.query;
    const path = `/api/items/${serviceKey}/${digestId}`;
    let url = path;
    if (context.req !== undefined) {
      // handle server side requests as isomorphic-unfetch on server side needs absolute url
      const host = context.req.headers.host;
      if (host.startsWith('localhost')) {
        url = `http://localhost:3000${path}`;
      } else {
        url = `https://${host}${path}`;
      }
    }
    const res = await fetch(url);
    const items = await res.json();
    return items;
  }

  render() {
    return (
      <div>
        <Layout title="Digest">
          {this.props.items.map((item: any) => (
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
    )
  }
}

export default Digest;
