import Head from 'next/head';
import App from 'next/app';
import 'bootstrap/dist/css/bootstrap.css';

import '../styles/globals.css';
import Layout from '../layouts/Layout';

import { store } from '../store/store';
import { Provider } from 'react-redux';

class MyApp extends App {
  componentDidMount() {}

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta
            name="description"
            content="Game that will make your mind exploded"
          ></meta>
          <title>Escape Plan</title>
        </Head>

        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </>
    );
  }
}

export default MyApp;
