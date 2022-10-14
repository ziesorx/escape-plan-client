import Head from 'next/head';
import Image from 'next/image';
import App from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';

import '../styles/globals.css';
import Layout from '../layouts/Layout';
import { socket } from '../services/socket';

class MyApp extends App {
  componentDidMount() {
    socket.on('connect');
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="description" content="Escape Plan Staging"></meta>
          <title>Escape Plan</title>
        </Head>

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  }
}

export default MyApp;
