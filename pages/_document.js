import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          {/* <link
            rel="shortcut icon"
            href={require('assets/img/brand/s2s-logo.ico')}
          /> */}
          {/* Fonts and icons */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="g-sidenav-show g-sidenav-pinned">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
