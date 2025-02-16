export function buildReducerTester<TState, TAction>(
    reducer: (state: TState, action: TAction) => TState,
    stateBuilder: (partialState: Partial<TState>) => TState,
) {
    return function (partialInitialState: Partial<TState>, action: TAction, stateChange: Partial<TState>) {
        const initialState = stateBuilder(partialInitialState);
        const expectedState: TState = {
            ...initialState,
            ...stateChange,
        };

        const resultingState = reducer(initialState, action);

        expect(resultingState).toEqual(expectedState);
    };
}
