import {createContext, useContext} from 'react';
import {DataStore} from "../stores"

export const DataStoreContext = createContext<DataStore>({} as DataStore);

export const useDataStore = () => useContext(DataStoreContext);