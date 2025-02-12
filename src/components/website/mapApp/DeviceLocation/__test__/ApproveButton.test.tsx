import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { click, testDispatchedAction } from '../../../../../../tests/utils/RenderingHelpers';
import { ApproveButton } from '../ApproveButton';
import { deviceApproveRequest } from '../../redux/DeviceAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('ApproveButton action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch approve request on approve device button click', () => {
        click(<ApproveButton id={'try to approve me'} />, 'approveDeviceButton');

        testDispatchedAction(deviceApproveRequest('try to approve me'));
    });
});
