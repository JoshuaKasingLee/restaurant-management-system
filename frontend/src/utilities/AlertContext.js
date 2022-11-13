import * as React from 'react';

const initialState = {
  text: '',
};

const AlertContext = React.createContext({
  ...initialState,
  setAlert: () => {},
});

export const AlertProvider = ({ children }) => {
  const [text, setText] = React.useState('');

  const setAlert = (text) => {
    setText(text);
  };

  return (
    <AlertContext.Provider
    value={{
        text,
        setAlert,
    }}
    >
    {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;