import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { buildTestStateObservable } from '../../../../../redux/__mocks__/stateBuilders';
import { DevicesClient } from '../../../../../redux/store';
import { MapAppState, buildMapAppState } from '../../../mapApp/redux/MapAppState';

export async function testDevicesEpic(
    devicesClient: DevicesClient,
    mapAppState: Partial<MapAppState>,
    sentAction: MapAppAction,
    expectedActions: MapAppAction[],
) {
    const output$ = devices(of(sentAction), buildTestStateObservable({ mapAppState: buildMapAppState(mapAppState) }), {
        devicesClient: devicesClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}
