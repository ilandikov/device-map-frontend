import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest } from '../../../../../../tests/utils/RenderingHelpers';
import { DeleteButton } from '../DeleteButton';
import { mapAppDeleteDeviceRequest } from '../../redux/MapAppRemoteActions';

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
        const container = renderForActionDispatchTest(<DeleteButton id={'try to delete me'} />);

        const loginButton = getByTestId(container, 'deleteDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppDeleteDeviceRequest('try to delete me'));
    });
});
