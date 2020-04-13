import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from '@dhis2/app-runtime';
import {StoreProvider} from './Contexts';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const appConfig = {
  baseUrl: process.env.REACT_APP_DHIS2_BASE_URL,
  apiVersion: 32,
};

ReactDOM.render(
  <Provider config={appConfig}>
    <StoreProvider>
      <App/>
    </StoreProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
