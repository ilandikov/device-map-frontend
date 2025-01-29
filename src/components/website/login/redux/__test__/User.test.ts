import { lastValueFrom, of, toArray } from 'rxjs';
import { mapAppGetUserPoints, mapAppGetUserPointsError, mapAppSetUserPoints } from '../../../mapApp/redux/MapAppAction';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { user } from '../User';

describe('user epic tests', () => {
    it('should get user points', async () => {
        const initialState = buildMapAppState({});
        const action = of(mapAppGetUserPoints());
        const expectedAction = mapAppSetUserPoints(320);

        const output$ = user(action, buildStateForDevicesTest(initialState), {
            userClient: () => Promise.resolve({ points: 320 }),
        });

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));
        expect(receivedAction).toEqual([expectedAction]);
    });

    it('should report remote error', async () => {
        const initialState = buildMapAppState({});
        const action = of(mapAppGetUserPoints());
        const expectedAction = mapAppGetUserPointsError('could not get user points');

        const output$ = user(action, buildStateForDevicesTest(initialState), {
            userClient: () => Promise.reject('could not get user points'),
        });

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));
        expect(receivedAction).toEqual([expectedAction]);
    });
});
