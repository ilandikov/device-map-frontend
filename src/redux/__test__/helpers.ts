import { StateBuilder } from '../store';

export function buildReducerTester<TState, TAction>(
    reducer: (state: TState, action: TAction) => TState,
    stateBuilder: StateBuilder<TState>,
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

export function testInitialState<TState>(stateBuilder: StateBuilder<TState>, expectedInitialState: TState) {
    expect(stateBuilder({})).toMatchObject<TState>(expectedInitialState);
}
