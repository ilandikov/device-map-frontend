import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const output$ = devices(of(sentAction), buildStateForDevicesTest(), { cognitoClient: {} });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}
