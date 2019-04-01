export const FETCH_HOME = "FETCH_HOME";

interface FetchHomeAction {
    type: typeof FETCH_HOME;
    payload: any;
}

export const fetchHomeAction = (): FetchHomeAction => ({
    type: FETCH_HOME,
    payload: "Test datas"
});

export type HomeActionsType = FetchHomeAction;
