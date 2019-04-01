import { ReducerState } from "../../reducers";
import * as actions from "./actions";

interface State {
    data: string | null;
}

const initialState: State = {
    data: null
};

const reducer: ReducerState<State> = (state = initialState, action: actions.HomeActionsType) => {
    switch (action.type) {
        case actions.FETCH_HOME: {
            return { ...state, data: action.payload };
        }
        default:
            return state;
    }
};

export default reducer;
