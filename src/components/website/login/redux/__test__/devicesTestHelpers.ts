import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { buildMapAppState } from '../../../mapApp/redux/MapAppState';
import { DevicesClient } from '../../../../../redux/store';

export async function testDevicesEpic(
    devicesClient: DevicesClient,
    sentAction: MapAppAction,
    expectedActions: MapAppAction[],
) {
    const output$ = devices(of(sentAction), buildStateForDevicesTest(buildMapAppState({})), {
        devicesClient: devicesClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}
