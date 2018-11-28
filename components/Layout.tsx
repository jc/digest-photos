import Head from 'next/head'
import { Header } from '../components/Header';

export const Layout: React.SFC<{ title: string }> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title}</title>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
      <link href="//fonts.googleapis.com/css?family=Cabin" rel="stylesheet" type="text/css"></link>
      <link href="//fonts.googleapis.com/css?family=Droid+Serif" rel="stylesheet" type="text/css"></link>
    </Head>
    <div id="sitewrap">
      <Header />
      {children}
    </div>
    <style jsx>{`
      #sitewrap {
        background: #fff;
        width: 800px;
        margin: 0 auto;
        padding: 0 60px;
      }
    `}
    </style>
    <style jsx global>{`
      html, body, div, span {
        margin: 0;
        padding: 0;
        border: 0;
        font-weight: inherit;
        font-style: inherit;
        vertical-align: baseline;
      }

      body, input {
        color: #4b4b4b;
        font-family: 'Cabin', Helvetica, sans-serif;
        font-size: 18px;
        line-height: 22px;
      }        
      
      .text {
        margin: auto;
      }

      p {
        font-size: 1.0em;
      }
      a { color: #2ba6cb; }
      a:link { color: #2ba6cb; }
      a:visited { color: #cb2ba6; }
    `}</style>
  </div>
)