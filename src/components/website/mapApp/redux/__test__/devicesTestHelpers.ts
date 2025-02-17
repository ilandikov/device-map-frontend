import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../MapAppAction';
import { devices } from '../devices';
import { ShallowPartial, buildTestStateObservable } from '../../../../../redux/__mocks__/state';
import { AllActions, DevicesClient, RemoteClients, RootEpic, RootState } from '../../../../../redux/store';
import { MapAppState } from '../MapAppState';

function buildEpicTester(epic: RootEpic) {
    return async function (
        remoteClients: RemoteClients,
        partialRootState: ShallowPartial<RootState>,
        sentAction: AllActions,
        expectedActions: AllActions[],
    ) {
        const output$ = epic(of(sentAction), buildTestStateObservable(partialRootState), remoteClients);

        const receivedAction = await lastValueFrom(output$.pipe(toArray()));

        expect(receivedAction).toEqual(expectedActions);
    };
}

export async function testDevicesEpic(
    devicesClient: DevicesClient,
    mapAppState: Partial<MapAppState>,
    sentAction: MapAppAction,
    expectedActions: MapAppAction[],
) {
    const testDevicesEpic1 = buildEpicTester(devices);
    await testDevicesEpic1({ devicesClient }, { mapAppState }, sentAction, expectedActions);
}

export const resolvingDevicesClient: DevicesClient = {
    forAnonymousUser: {
        listDevices: () =>
            Promise.resolve({
                devices: [
                    {
                        __typename: 'T22Device',
                        id: 'dev1',
                        createdDate: '1754126457812',
                        creatorID: 'fancy creator',
                        location: {
                            __typename: 'T22Location',
                            lat: 42.85862508449081,
                            lon: 74.6085298061371,
                        },
                    },
                ],
                count: 1,
            }),
    },
    forAuthenticatedUser: {
        createDevice: (createDeviceInput) =>
            Promise.resolve({
                device: {
                    id: 'testId',
                    createdDate: '1796354896548',
                    creatorID: 'new creator',
                    location: createDeviceInput.location,
                },
            }),
        deleteDevice: (deleteDeviceInput) => Promise.resolve({ id: deleteDeviceInput.id }),
        approveDevice: (approveDeviceInput) => Promise.resolve({ id: approveDeviceInput.id, lastUpdate: Date.now() }),
    },
};

export const rejectingDevicesClient: DevicesClient = {
    forAnonymousUser: {
        listDevices: () => Promise.reject('list devices went wrong'),
    },
    forAuthenticatedUser: {
        createDevice: () => Promise.reject('create device went wrong'),
        deleteDevice: () => Promise.reject('delete device went wrong'),
        approveDevice: () => Promise.reject('approve device went wrong'),
    },
};
