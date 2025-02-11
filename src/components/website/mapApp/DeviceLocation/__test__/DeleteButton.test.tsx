import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { click, testDispatchedAction } from '../../../../../../tests/utils/RenderingHelpers';
import { DeleteButton } from '../DeleteButton';
import { deviceDeleteRequest } from '../../redux/DeviceAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('DeleteButton action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch delete device request on delete device button click', () => {
        click(<DeleteButton id={'try to delete me'} />, 'deleteDeviceButton');

        testDispatchedAction(deviceDeleteRequest('try to delete me'));
    });
});
