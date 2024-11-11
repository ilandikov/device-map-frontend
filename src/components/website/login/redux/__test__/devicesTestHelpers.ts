import { lastValueFrom, of, toArray } from 'rxjs';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { MapAppAction, MapAppSetDevices } from '../../../mapApp/redux/MapAppAction';
import { devices, processListDevicesRequest } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { MapAppState } from '../../../mapApp/redux/MapAppState';

export async function testDevicesEpic(
    sentAction: MapAppAction,
    mapAppState: MapAppState,
    expectedActions: MapAppAction[],
) {
    const output$ = devices(of(sentAction), buildStateForDevicesTest(mapAppState), {});

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}

export async function testListDevicesProcessor(
    remoteAnswer: Promise<T22Device[]>,
    expectedActions: MapAppSetDevices[],
) {
    const receivedAction = await lastValueFrom(processListDevicesRequest(remoteAnswer).pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}
