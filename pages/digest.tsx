import { Photograph } from '../components/Photograph';
import { Layout } from '../components/Layout';
import React from 'react';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import { withRouter, WithRouterProps } from 'next/router';
import { NextContext } from 'next';

interface DigestProps {
  items: any,
  error?: string
}

class Digest extends React.PureComponent<DigestProps & WithRouterProps> {
  static async getInitialProps(context: NextContext) {
    if (context.query.preloaded === undefined) {
      const client = Stitch.hasAppClient("digestif-qdsft") ?
        Stitch.defaultAppClient :
        Stitch.initializeDefaultAppClient("digestif-qdsft");
      await client.auth.loginWithCredential(new AnonymousCredential());
      const { digest } = context.query;
      const items = await client.callFunction("digestContents", [digest]);
      return items;
    } else {
      return context.query.preloaded;
    }
  }

  render() {
    return (
      <div>
        <Layout title="Digest">
          {this.props.items.map((item: any) => (
            <Photograph
              key={item.item_key}
              url={`http://farm${item.farm}.staticflickr.com/${item.server}/${item.item_key}_${item.secret}_z.jpg`}
              link={`http://www.flickr.com/photos/${item.service_key}/${item.item_key}`}
              description={item.description}
              title={item.title}
            />
          ))}
        </Layout>
      </div>
    )
  }
}

export default withRouter(Digest);
