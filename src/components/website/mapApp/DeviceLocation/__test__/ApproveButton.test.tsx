import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest } from '../../../../../../tests/utils/RenderingHelpers';
import { ApproveButton } from '../ApproveButton';
import { deviceApproveRequest } from '../../redux/MapAppRemoteActions';

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
        const container = renderForActionDispatchTest(<ApproveButton id={'try to approve me'} />);

        const loginButton = getByTestId(container, 'approveDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, deviceApproveRequest('try to approve me'));
    });
});
