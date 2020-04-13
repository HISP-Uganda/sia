import React, {useEffect} from 'react';
import {
  HashRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import {useDataEngine} from '@dhis2/app-runtime';

import {Home} from "./Home";
import {Configurations} from "./Configurations";
import {useStore} from "./Contexts";

import './App.css';

function App() {
  const engine = useDataEngine();
  const store = useStore();
  store.setEngine(engine);

  useEffect(() => {
    store.fetchOrganisations();
  }, [store]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/configurations">
          <Configurations/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
