import Document, { Html, Head, Main, NextScript } from 'next/document'
import delay from 'delay';

class MyDocument extends Document {
  // static async getInitialProps(ctx) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return { ...initialProps }
  // }

  render() {
    return (
      <Html>
        <Head>
          <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet" key="test" />
          <link href="/static/tachyons/css/tachyons.min.css" rel="stylesheet" key="test" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
            key="viewport"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;