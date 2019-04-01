import { applyMiddleware, compose, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import rootReducer from "./client/reducers";

interface ReduxWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    INITIAL_STATE: {};
}
declare let window: ReduxWindow;

let composeEnhancers = compose;
let preloadedState = {};

if (typeof window !== "undefined") {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    preloadedState = window.INITIAL_STATE || {};
    delete window.INITIAL_STATE; // Once we loaded the initial state we can safely delete it so we can't access it from the browser
}

export default createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(thunkMiddleware)));
