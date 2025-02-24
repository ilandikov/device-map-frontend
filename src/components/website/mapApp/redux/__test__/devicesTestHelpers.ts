import { DevicesClient } from '../../../../../redux/store';

export const resolvingDevicesClient: DevicesClient = {
    forAnonymousUser: {
        listDevices: () =>
            Promise.resolve({
                devices: [
                    {
                        id: 'dev1',
                        createdDate: '1754126457812',
                        lastUpdate: '1754126458923',
                        creatorID: 'fancy creator',
                        location: {
                            lat: 42.85862508449081,
                            lon: 74.6085298061371,
                        },
                        approvals: 6,
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
                    lastUpdate: '1796354897659',
                    creatorID: 'new creator',
                    location: createDeviceInput.location,
                    approvals: 0,
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
