import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from '../store';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </Provider>
  );
}

export default MyApp;