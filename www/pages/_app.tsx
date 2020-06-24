import { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'

import { Layout } from '../components/layout'
import { theme } from '../lib/theme'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp
