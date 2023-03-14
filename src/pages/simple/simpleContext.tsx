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

const storeContext = createContext<UseStoreDataReturnType|null>(null);

