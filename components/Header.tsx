import Link from 'next/link'

export const Header: React.SFC = () => (
  <div id="header" className="text">
    <h1>
      <Link as="/" href="/index"><a>Digestif</a></Link>
    </h1>
    <style jsx>{`
        #header {
          margin: 1em auto;
          padding-top: 0.5em;
          border-bottom: solid 1px #333;
          text-align: left;
        }

        h1 {
          margin: 0;
          padding: 0;
          font-size: 52px;
          text-shadow: none;
          line-height: 62px;
          font-weight:normal;
          font-style:italic;
          font-family: Georgia, "Times New Roman", Times, serif;
          text-shadow: #ccc 2px 2px 2px;
          letter-spacing: -.05em;
          word-spacing: -1px;
        }

        h1 a, h1 a:link, h1 a:visited {
          color: #000;
          text-decoration: none;
        }
    `}
    </style>
  </div>
)