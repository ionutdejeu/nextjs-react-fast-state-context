'use client';
import React, { useState, createContext, useContext, memo } from "react";

function useStoreData() {
    const store = useState({
        first: "",
        last: "",
    });
    return store;
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

const storeContext = createContext<UseStoreDataReturnType | null>(null);


const TextInput = ({ value }: { value: "first" | "last" }) => {
    const [store, setStore] = useContext(storeContext)!;
    return (
        <div className="field">
            {value}:{" "}
            <input
                value={store[value]}
                onChange={(e) => setStore({ ...store, [value]: e.target.value })}
            />
        </div>
    );
};

const Display = ({ value }: { value: "first" | "last" }) => {
    const [store] = useContext(storeContext)!;
    return (
        <div className="value">
            {value}: {store[value]}
        </div>
    );
};

const FormContainer = memo(() => {
    return (
      <div className="container">
        <h5>FormContainer</h5>
        <TextInput value="first" />
        <TextInput value="last" />
      </div>
    );
  });
  
  const DisplayContainer = memo(() => {
    return (
      <div className="container">
        <h5>DisplayContainer</h5>
        <Display value="first" />
        <Display value="last" />
      </div>
    );
  });
  
  const ContentContainer = memo(() => {
    return (
      <div className="container">
        <h5>ContentContainer</h5>
        <FormContainer />
        <DisplayContainer />
      </div>
    );
  });
  
  function App() {
    const store = useState({
      first: "",
      last: "",
    });
  
    return (
      <storeContext.Provider value={store}>
        <div className="container">
          <h5>App</h5>
          <ContentContainer />
        </div>
      </storeContext.Provider>
    );
  }
  App.displayName = 'MyApp';
  export default App;