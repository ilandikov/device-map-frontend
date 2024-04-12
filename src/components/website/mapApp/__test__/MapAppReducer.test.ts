import { MapAppReducer, MapAppState, MapAppUsageStep, mapAppInitialState } from '../redux/MapAppReducer';
import { mapAppLoginModalClose, mapAppUserButtonClick } from '../redux/actions';

function buildMapAppState(partialState: Partial<MapAppState>): MapAppState {
    return { ...partialState, ...mapAppInitialState };
}

describe('MapApp reducer tests', () => {
    it('should return initial state: user is not logged in', () => {
        // @ts-ignore
        const initialState = MapAppReducer(undefined, { type: 'DUMMY_ACTION' });

        const expectedInitialState = buildMapAppState({});

        expect(initialState).toEqual(expectedInitialState);
    });

    it('should move to user authentication step on user button click', () => {
        const action = mapAppUserButtonClick();

        const resultingState = MapAppReducer(undefined, action);

        const expectedState: MapAppState = {
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        };
        expect(resultingState).toEqual(expectedState);
    });

    it('should move to home screen on navigation cancel action', () => {
        const initialState = buildMapAppState({
            usageStep: MapAppUsageStep.USER_AUTHENTICATION,
        });
        const action = mapAppLoginModalClose();

        const stateChange: Partial<MapAppState> = { usageStep: MapAppUsageStep.HOME_SCREEN };

        const resultingState = MapAppReducer(initialState, action);

        const expectedState: MapAppState = {
            ...stateChange,
            ...initialState,
        };
        expect(resultingState).toEqual(expectedState);
    });
});
