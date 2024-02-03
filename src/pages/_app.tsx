import 'src/css/global.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Snake Game</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
