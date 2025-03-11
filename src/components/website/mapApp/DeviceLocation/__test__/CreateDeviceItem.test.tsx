import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
} from '../../../../../../tests/utils/RenderingHelpers';
import { CreateDeviceItem } from '../CreateDeviceItem';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';
import { deviceCreateRequest, deviceCreationSubscriptionRequest } from '../../redux/DeviceAction';
import { CreateAccountOrLoginButton2 } from '../CreateAccountOrLoginButton';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Create Device Item action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch create device action on create device button click', () => {
        mockMapAppState({ loggedInUser: { id: 'i can create a device', points: 0 } });

        click(<CreateDeviceItem />, 'createDeviceButton');

        testDispatchedActionsInOrder([deviceCreateRequest(), deviceCreationSubscriptionRequest()]);
    });

    it('should dispatch reset current user', () => {
        click(<CreateAccountOrLoginButton2 />, 'createAccountOrLoginButton');

        testDispatchedAction(mapAppResetCurrentUser());
    });
});
