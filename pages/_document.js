import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";
import GlobalStyle from "@styles/globalStyles";

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(
              <React.Fragment>
                <GlobalStyle />
                <App {...props} />
              </React.Fragment>
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* View and Basic Info */}
          <meta charSet="UTF-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="author" content="Top App" />
          <meta name="copyright" content="Copyright owner" />

          {/* SEO */}
          <meta name="robots" content="follow" />

          {/* PWA */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta name="application-name" content="Top App" />
          <meta name="apple-mobile-web-app-status-bar-style" content="white" />
          <meta name="apple-touch-fullscreen" content="yes" />
          <link
            rel="icon"
            type="image/x-icon"
            href="/logos/Main.png"
          /> 
          <meta name="theme-color" content="#f6f6f7" />
          <meta name="apple-mobile-web-app-title" content="Kidz-N-Motion" />
          <meta name="msapplication-TileColor" content="#f6f6f7" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
