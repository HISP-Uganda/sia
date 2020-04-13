import React, {createContext, useContext, useEffect, useState} from 'react';
import {createStore} from './stores/Store';
import {useLocalStore} from 'mobx-react';
import {useLocation} from "react-router-dom";

export const StoreContext = createContext(null);

export const StoreProvider = ({children}) => {
  const store = useLocalStore(createStore);
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
};

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

function getWindowDimensions() {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
