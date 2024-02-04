import App from "next/app";
import React from "react";

import { DefaultSeo } from "next-seo";
import Script from "next/script";
import Head from "next/head";

import Layout from "@containers/Layout";
import { RecoilRoot } from "recoil";

require("@styles/variables.less");

import { ApolloProvider } from "@apollo/client";
import client from "@utils/apolloClient";

class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = { color: "#ff9800" };
  }

  componentDidMount() {
    // Fixes the scroll jump issue when going to pages of different heights
    window.history.scrollRestoration = "manual";

    // If the user uses a keyboard then override the no outline styling
    window.addEventListener("keydown", this._handleKeydown);
  }

  _handleKeydown(e) {
    // Detect a keyboard user from a tab key press
    const isTabEvent = e.keyCode === 9;

    if (isTabEvent) {
      document.body.classList.add("using-keyboard");
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width, maximum-scale=5.0"
            key="viewport"
          />
        </Head>

        <>
          <DefaultSeo title="Home" titleTemplate="%s  | Kidz-N-Motion" />

          <RecoilRoot>
            <ApolloProvider client={client}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ApolloProvider>
          </RecoilRoot>
          {/* <style  */}
          jsx="true"
           global>{`
            // Global fonts
            @font-face {
              font-family: "Gilroy";
              src: url("/fonts/bold/Gilroy-Bold.woff") format("woff"),
                /* Modern Browsers */ url("/fonts/bold/Gilroy-Bold.woff2")
                  format("woff2"); /* Modern Browsers */
              font-weight: 800;
              font-style: normal;
              font-display: block;
            }
            @font-face {
              font-family: "Gilroy";
              src: url("/fonts/semi-bold/Gilroy-SemiBold.woff") format("woff"),
                /* Modern Browsers */
                  url("/fonts/semi-bold/Gilroy-SemiBold.woff2") format("woff2"); /* Modern Browsers */
              font-weight: 600;
              font-style: normal;
              font-display: block;
            }
            @font-face {
              font-family: "Gilroy";
              src: url("/fonts/medium/Gilroy-Medium.woff") format("woff"),
                /* Modern Browsers */ url("/fonts/bold/Gilroy-Medium.woff2")
                  format("woff2"); /* Modern Browsers */
              font-weight: 400;
              font-style: normal;
              font-display: block;
            }
            @font-face {
              font-family: "Gilroy";
              src: url("/fonts/regular/Gilroy-Regular.woff") format("woff"),
                /* Modern Browsers */ url("/fonts/regular/Gilroy-Regular.woff2")
                  format("woff2"); /* Modern Browsers */
              font-weight: 100;
              font-style: normal;
              font-display: block;
            }
          `}
          {/* </style> */}
        </>
        <Script
          strategy="afterInteractive"
          id="facebook-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d){var s = d.createElement("script");s.setAttribute("data-account", "iL8vpSq4Dj");s.setAttribute("src", "https://accessibilityserver.org/widget.js");(d.body || d.head).appendChild(s);})(document)
              `,
          }}
        />
      </>
    );
  }
}

export default MyApp;
