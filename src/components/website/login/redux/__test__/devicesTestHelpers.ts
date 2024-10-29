import { lastValueFrom, of, toArray } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { MapAppAction, MapAppRemoteAnswer } from '../../../mapApp/redux/MapAppAction';
import { devices, processListDevicesRequest } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';
import { T22ListDevicesResponse } from '../devicesHelpers';

export async function testDevicesEpic(sentAction: MapAppAction, expectedActions: MapAppAction[]) {
    const output$ = devices(of(sentAction), buildStateForDevicesTest(), {
        apolloClient: {
            listDevices: () =>
                Promise.resolve({
                    data: {
                        T22ListDevices: [
                            {
                                __typename: 'T22Device',
                                id: 'dev1',
                                location: {
                                    __typename: 'T22Location',
                                    lat: 42.85862508449081,
                                    lon: 74.6085298061371,
                                },
                            },
                        ],
                    },
                    loading: false,
                    networkStatus: 7,
                }),
        },
    });

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
