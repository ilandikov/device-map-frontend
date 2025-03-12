import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
    testSnapshot,
} from '../../../../../../tests/utils/RenderingHelpers';
import { ExtraItem } from '../ExtraItem';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';
import { deviceCreateRequest, deviceCreation, deviceCreationSubscriptionRequest } from '../../redux/DeviceAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Extra Item snapshot tests', () => {
    it('should show only the create account or login button', () => {
        mockMapAppState({
            loggedInUser: null,
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<ExtraItem />);
    });

    it('should show only the create device item', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in', points: 0 },
            isDeviceCreationOngoing: false,
        });

        testSnapshot(<ExtraItem />);
    });

    it('should show the temporary item and the create device item', () => {
        mockMapAppState({
            loggedInUser: { id: 'i am logged in', points: 0 },
            isDeviceCreationOngoing: true,
        });

        testSnapshot(<ExtraItem />);
    });
});

describe('Extra Item action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch reset current user', () => {
        mockMapAppState({ loggedInUser: null });

        click(<ExtraItem />, 'createAccountOrLoginButton');

        testDispatchedAction(mapAppResetCurrentUser());
    });

    it('should dispatch create device action', () => {
        mockMapAppState({ loggedInUser: { id: 'i can create a device', points: 0 } });

        click(<ExtraItem />, 'createDeviceButton');

        testDispatchedActionsInOrder([
            deviceCreateRequest(),
            deviceCreationSubscriptionRequest(),
            deviceCreation(true),
        ]);
    });
});
