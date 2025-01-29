import { Observable, lastValueFrom, of, toArray } from 'rxjs';
import {
    MapAppAction,
    mapAppGetUserPoints,
    mapAppGetUserPointsError,
    mapAppSetUserPoints,
} from '../../../mapApp/redux/MapAppAction';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { MapAppState, buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { user } from '../User';
import { UserClient } from '../../../../../redux/store';

const userResolvingClient = () => Promise.resolve({ points: 320 });
const userRejectingClient = () => Promise.reject('could not get user points');

async function testUserEpic(
    userClient: UserClient,
    action: Observable<MapAppAction>,
    initialState: MapAppState,
    expectedAction: MapAppAction,
) {
    const output$ = user(action, buildStateForDevicesTest(initialState), {
        userClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([expectedAction]);
}

describe('user epic tests', () => {
    it('should get user points', async () => {
        const initialState = buildMapAppState({});
        const action = of(mapAppGetUserPoints());
        const expectedAction = mapAppSetUserPoints(320);

        await testUserEpic(userResolvingClient, action, initialState, expectedAction);
    });

    it('should report remote error', async () => {
        const initialState = buildMapAppState({});
        const action = of(mapAppGetUserPoints());
        const expectedAction = mapAppGetUserPointsError('could not get user points');

        const output$ = user(action, buildStateForDevicesTest(initialState), {
            userClient: userRejectingClient,
        });

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));
        expect(receivedAction).toEqual([expectedAction]);
    });
});
