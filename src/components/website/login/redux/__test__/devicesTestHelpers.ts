import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';
import { devices } from '../devices';
import { buildStateForDevicesTest } from '../../../../../redux/__mocks__/stateBuilders';

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
