import '../styles/index.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='customcontainer mx-auto'>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
