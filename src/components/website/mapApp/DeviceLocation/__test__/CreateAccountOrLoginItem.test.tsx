import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { click, testDispatchedAction } from '../../../../../../tests/utils/RenderingHelpers';
import { mapAppResetCurrentUser } from '../../redux/MapAppAction';
import { DeviceList } from '../DeviceList';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Create Account Or Login Item action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch reset current user', () => {
        mockMapAppState({ loggedInUser: null });

        click(<DeviceList />, 'createAccountOrLoginButton');

        testDispatchedAction(mapAppResetCurrentUser());
    });
});
