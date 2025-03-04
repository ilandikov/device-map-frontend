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

export function buildEpicTester(epic: RootEpic) {
    return async function (
        remoteClients: RemoteClients,
        partialRootState: ShallowPartial<RootState>,
        sentAction: AllActions,
        expectedActions: AllActions[],
    ) {
        const output$ = epic(of(sentAction), buildTestStateObservable(partialRootState), remoteClients);

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));

        expect(receivedAction).toEqual(expectedActions);
    };
}

export interface EpicTest {
    epic: RootEpic;
    remoteClients: RemoteClients;
    partialRootState: ShallowPartial<RootState>;
    sentAction: AllActions;
    expectedActions: AllActions[];
}

export async function testEpicAnswerToAction(scenario: EpicTest) {
    const output$ = scenario.epic(
        of(scenario.sentAction),
        buildTestStateObservable(scenario.partialRootState),
        scenario.remoteClients,
    );

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(scenario.expectedActions);
}
