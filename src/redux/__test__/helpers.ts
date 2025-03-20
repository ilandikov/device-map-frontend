import { lastValueFrom, of, toArray } from 'rxjs';
import { AllActions, RemoteClients, RootEpic, RootState, StateBuilder } from '../store';
import { ShallowPartial, buildTestStateObservable } from '../__mocks__/state';

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

interface EpicTest {
    epic: RootEpic;
    remoteClients?: RemoteClients;
    partialRootState?: ShallowPartial<RootState>;
    sentAction: AllActions;
    expectedActions: AllActions[];
}

export function itShouldAnswerBy(testName: string, scenario: EpicTest) {
    it(testName, async () => {
        const output$ = scenario.epic(
            of(scenario.sentAction),
            buildTestStateObservable(scenario.partialRootState ?? {}),
            scenario.remoteClients ?? {},
        );

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));

        expect(receivedAction).toEqual(scenario.expectedActions);
    });
}

interface ReducerTest<TState, TAction> {
    reducer: (state: TState, action: TAction) => TState;
    stateBuilder: StateBuilder<TState>;
    initialState: Partial<TState>;
    action: TAction;
    stateChange: Partial<TState>;
}

export function itShouldReduceBy<TState, TAction>(name: string, scenario: ReducerTest<TState, TAction>) {
    const { reducer, stateBuilder, initialState, action, stateChange } = scenario;
    it(name, () => {
        const resultingState = reducer(stateBuilder(initialState), action);

        expect(resultingState).toEqual({
            ...stateBuilder(initialState),
            ...stateChange,
        });
    });
}
