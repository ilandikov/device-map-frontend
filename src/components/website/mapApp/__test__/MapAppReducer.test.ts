import { MapAppReducer, MapAppState, MapAppUsageStep, mapAppInitialState } from '../redux/MapAppReducer';
import { MapAppAction, mapAppLoginModalClose, mapAppUserButtonClick } from '../redux/actions';

function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...partialState, ...mapAppInitialState };
}

function verifyMapAppStateChange(initialState: MapAppState, action: MapAppAction, stateChange: Partial<MapAppState>) {
    const resultingState = MapAppReducer(initialState, action);

    const expectedState: MapAppState = {
        ...initialState,
        ...stateChange,
    };
    expect(resultingState).toEqual(expectedState);
}

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        // @ts-ignore
        const initialState = MapAppReducer(undefined, { type: 'DUMMY_ACTION' });

        const expectedInitialState = buildMapAppState({});

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should move to user authentication step on user button click', () => {
        const initialState = buildMapAppState({});
        const action = mapAppUserButtonClick();

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.USER_AUTHENTICATION });
    });

    it('should move to home screen on navigation cancel action', () => {
        const initialState = buildMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        });
        const action = mapAppLoginModalClose();

        verifyMapAppStateChange(initialState, action, { usageStep: MapAppUsageStep.HOME_SCREEN });
    });
});
