import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
    testSnapshot,
} from '../../../../../../tests/utils/RenderingHelpers';
import { deviceCreateRequest, deviceCreation, deviceCreationSubscriptionRequest } from '../../redux/DeviceAction';
import { DeviceList } from '../DeviceList';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Device List snapshot tests', () => {
    it('should show only the device matching the selected marker', () => {
        mockMapAppState({
            devices: [
                {
                    id: 'Not matching selected marker',
                    createdDate: '0000000000001',
                    lastUpdate: '0000000000002',
                    creatorID: 'someone',
                    location: { lat: 0, lon: 0 },
                    approvals: 0,
                },
                {
                    id: 'Matching selected marker',
                    createdDate: '0000000000001',
                    lastUpdate: '0000000000002',
                    creatorID: 'I created the second one!',
                    location: { lat: 26.3553423, lon: 19.23131 },
                    approvals: 0,
                },
            ],
            selectedMarker: {
                location: { lat: 26.3553423, lon: 19.23131 },
                address: null,
            },
            loggedInUser: null,
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<DeviceList />);
    });
});

describe('Create Device Item action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch reset current user', () => {
        mockMapAppState({ loggedInUser: null });

        click(<DeviceList />, 'createAccountOrLoginButton');

        testDispatchedAction(mapAppResetCurrentUser());
    });

    it('should dispatch create device action', () => {
        mockMapAppState({ loggedInUser: { id: 'i can create a device', points: 0 } });

        click(<DeviceList />, 'createDeviceButton');

        testDispatchedActionsInOrder([
            deviceCreateRequest(),
            deviceCreationSubscriptionRequest(),
            deviceCreation(true),
        ]);
    });
});
