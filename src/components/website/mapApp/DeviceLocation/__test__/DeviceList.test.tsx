import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
} from '../../../../../../tests/utils/RenderingHelpers';
import { deviceCreateRequest, deviceCreationSubscriptionRequest } from '../../redux/DeviceAction';
import { DeviceList } from '../DeviceList';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

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

        testDispatchedActionsInOrder([deviceCreateRequest(), deviceCreationSubscriptionRequest()]);
    });
});
