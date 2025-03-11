import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { click, testDispatchedActionsInOrder } from '../../../../../../tests/utils/RenderingHelpers';
import { CreateDeviceItem } from '../CreateDeviceItem';
import { deviceCreateRequest, deviceCreationSubscriptionRequest } from '../../redux/DeviceAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('Create Device Item action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch create device action', () => {
        click(<CreateDeviceItem />, 'createDeviceButton');

        testDispatchedActionsInOrder([deviceCreateRequest(), deviceCreationSubscriptionRequest()]);
    });
});
