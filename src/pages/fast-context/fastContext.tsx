'use client';
import React, { useRef, createContext, useContext, useCallback,useState,useEffect } from "react";

type StoreType = { first: string; last: string };
const storeValue = {
  first: "",
  last: "",
}
function useStoreData(): {
  get: () => StoreType;
  set: (value: Partial<StoreType>) => void;
  subscribe: (callback: () => void) => () => void;
} {
  
  const store = useRef<StoreType>(storeValue);
  const get = useCallback(() => store.current, []);
  const set = (value: Partial<StoreType>) => {
    store.current = { ...store.current, ...value }
    subscribersList.current.forEach((callback)=>callback())
  }
  const subscribersList = useRef(new Set<() => void>());


  const subscribe = useCallback((callback: () => void) => {
    subscribersList.current.add(callback)
    return () => subscribersList.current.delete(callback)
  }, [])

  return {
    get,
    set,
    subscribe
  }
}

function useStore(selector:(store:StoreType)=>any): [StoreType, (value: Partial<StoreType>) => void] {
  const store = useContext(storeContext)
  const store2 = useContext(createContext(useStoreData()))
  const [state,setState] = useState(selector(store?.get()));
  useEffect(()=>{
    return store?.subscribe(()=>{setState(selector(store.get()))})
  },[])

  if (!store) {
    console.error("Error, store not found");
    
  }
  if(store!=null){
    
    return [state,store.set]  
  }
    
  return [store2.get(),store2.set]
  
}

type UseStoreDataReturnType = ReturnType<typeof useStoreData>;

const storeContext = createContext<UseStoreDataReturnType|null>(null);

function Provider({ children }: { children: React.ReactNode }) {

  return (
    <storeContext.Provider value={useStoreData()}>
      {children}
    </storeContext.Provider>
  )
}

const TextInput = ({ value }: { value: "first" | "last" }) => {
  const [store, setStore] = useStore((store)=>store[value]);
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
  const [store] = useStore((store)=>store[value])!;
  return (
    <div className="value">
      {value}: {store[value]}
    </div>
  );
};

const FormContainer = () => {
  return (
    <div className="container">
      <h5>FormContainer</h5>
      <TextInput value="first" />
      <TextInput value="last" />
    </div>
  );
};

const DisplayContainer = () => {
  return (
    <div className="container">
      <h5>DisplayContainer</h5>
      <Display value="first" />
      <Display value="last" />
    </div>
  );
};

const ContentContainer = () => {
  return (
    <div className="container">
      <h5>ContentContainer</h5>
      <FormContainer />
      <DisplayContainer />
    </div>
  );
};

function App() {

  return (
    <Provider>
      <div className="container">
        <h5>App</h5>
        <ContentContainer />
      </div>
    </Provider>
  );
}
App.displayName = 'MyApp';
export default App;