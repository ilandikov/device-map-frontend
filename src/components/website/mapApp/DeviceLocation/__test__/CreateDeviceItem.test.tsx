import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import {
    click,
    testDispatchedAction,
    testDispatchedActionsInOrder,
} from '../../../../../../tests/utils/RenderingHelpers';
import { CreateDeviceItem } from '../CreateDeviceItem';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';
import { deviceCreateRequest, deviceCreationSubscriptionRequest } from '../../redux/DeviceAction';
import { CreateAccountOrLoginButton } from '../CreateAccountOrLoginButton';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('CreateDeviceItem action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch create device action', () => {
        click(<CreateDeviceItem />, 'createDeviceButton');

        testDispatchedActionsInOrder([deviceCreateRequest(), deviceCreationSubscriptionRequest()]);
    });
});

describe('CreateAccountOrLoginButton action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch reset current user', () => {
        click(<CreateAccountOrLoginButton />, 'createAccountOrLoginButton');

        testDispatchedAction(mapAppResetCurrentUser());
    });
});
