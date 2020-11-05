import Link from 'next/link'
import { Layout } from '../components/Layout';
import React from "react";

const Index = () => (
  <div>
    <Layout title="Digestif ">
      <div className="text">
        <p>Digestif is an easy way to share your photographs by email.</p>

        <p>Digestif converts your Flickr photostream into an email digest of photographs
        delivered to your friends and family on their terms. They decide how frequently
            (or infrequently) they want photographs.</p>
      </div>
      <div className="photo">
        <Link as="/digest/Lk" href="/digest/[id]"><a><img src="/static/digestif-mail.jpg" /></a></Link>
      </div>
      <style jsx>{`
        p {
          font-size: 1.2em;
          line-height: 1.2em;
        }
        .photo {
          display: flex;
          justify-content: center;
          align-items: baseline;
          margin-bottom: 1em;
        }
        img {
          flex: none;
          max-height: 1000px;
        }            
      `}
      </style>
    </Layout>
  </div>
);

export default Index;
