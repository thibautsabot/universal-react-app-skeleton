import { combineReducers } from "redux";

import Home from "./pages/Home/reducer";

export type ReducerState<T> = (
    state: any,
    action: {
        payload: any;
        type: any;
    }
) => T;

export default combineReducers({
    home: Home
});
