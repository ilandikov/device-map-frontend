import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../MapAppAction';
import { devices } from '../devices';
import { buildTestStateObservable } from '../../../../../redux/state';
import { DevicesClient } from '../../../../../redux/store';
import { MapAppState } from '../MapAppState';

export async function testDevicesEpic(
    devicesClient: DevicesClient,
    mapAppState: Partial<MapAppState>,
    sentAction: MapAppAction,
    expectedActions: MapAppAction[],
) {
    const output$ = devices(of(sentAction), buildTestStateObservable({ mapAppState }), {
        devicesClient: devicesClient,
    });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}
