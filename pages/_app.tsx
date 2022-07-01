//next
import type { AppProps } from 'next/app';
//nextauth
import { Provider } from 'next-auth/client';
//mantine/notifications
import { NotificationsProvider } from '@mantine/notifications';
//material ui
import { StyledEngineProvider } from '@mui/material/styles';
//components
import { Navbar } from '../components';
//style
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <NotificationsProvider>
        <StyledEngineProvider injectFirst>
          <Navbar />
          <Component {...pageProps} />
        </StyledEngineProvider>
      </NotificationsProvider>
    </Provider>
  );
}

export default MyApp;
