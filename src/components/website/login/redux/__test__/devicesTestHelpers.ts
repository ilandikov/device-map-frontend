import { lastValueFrom, of, toArray } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { MapAppAction, MapAppRemoteAnswer } from '../../../mapApp/redux/MapAppAction';
import { devices, processListDevicesRequest } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { T22ListDevicesResponse } from '../devicesHelpers';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const output$ = devices(of(sentAction), buildStateForDevicesTest(), {});

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));

    expect(receivedAction).toEqual(expectedActions);
}

export async function testListDevicesProcessor(
    remoteAnswer: Promise<ApolloQueryResult<T22ListDevicesResponse>>,
    expectedAction: MapAppRemoteAnswer,
) {
    const receivedAction = await lastValueFrom(processListDevicesRequest(remoteAnswer).pipe(toArray()));

    expect(receivedAction).toEqual([expectedAction]);
}
