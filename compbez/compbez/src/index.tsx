import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {DataStoreContext} from "./contexts";
import {dataStore} from "./stores";

ReactDOM.render(<DataStoreContext.Provider value={dataStore}><App/></DataStoreContext.Provider>, document.getElementById("root"));
