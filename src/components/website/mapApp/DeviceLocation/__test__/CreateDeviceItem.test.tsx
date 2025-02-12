import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { click, testDispatchedAction } from '../../../../../../tests/utils/RenderingHelpers';
import { CreateDeviceItem } from '../CreateDeviceItem';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';
import { deviceListRequest } from '../../redux/DeviceAction';

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

        testDispatchedAction(deviceListRequest());
    });

    it('should dispatch show login modal on create account or login button click', () => {
        mockMapAppState({ loggedInUser: null });

        click(<CreateDeviceItem />, 'createAccountOrLoginButton');

        testDispatchedAction(mapAppResetCurrentUser());
    });
});
