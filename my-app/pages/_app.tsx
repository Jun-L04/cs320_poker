import type { AppProps } from 'next/app'
import '../app/globals.css'   // <-- import your global stylesheet

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}