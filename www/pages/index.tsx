import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Styled } from 'theme-ui'

import { Footer } from '../components/footer';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>OwnStream</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Styled.h1>OwnStream</Styled.h1>
        <p>A self-hosted streaming platform. Created by musicians, for musicians.</p>
        <Footer />
      </Container>
    </>
  );
}

export default Home;