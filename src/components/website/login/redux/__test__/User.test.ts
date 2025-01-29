import { lastValueFrom, of, toArray } from 'rxjs';
import { mapAppGetUserPoints, mapAppSetUserPoints } from '../../../mapApp/redux/MapAppAction';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { user } from '../User';

describe('user epic tests', () => {
    it('should get user points', async () => {
        const initialState = buildMapAppState({});
        const action = of(mapAppGetUserPoints('fake user id'));
        const expectedAction = mapAppSetUserPoints(320);

        const output$ = user(action, buildStateForDevicesTest(initialState), {});

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));
        expect(receivedAction).toEqual([expectedAction]);
    });
});
