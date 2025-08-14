import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createContext } from 'react'

export const Context=createContext({isAuthorized: false});
const Wrapper=()=>{
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
      }}
    >
      <App />
    </Context.Provider>
  );
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Wrapper />
  </React.StrictMode>,
)
