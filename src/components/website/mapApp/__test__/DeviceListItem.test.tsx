import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest } from '../../../../../tests/utils/RenderingHelpers';
import { mapAppDeleteDeviceRequest } from '../redux/MapAppAction';
import { DeviceListItem } from '../DeviceListItem';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('DeviceListItem action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch delete device request on delete device button click', () => {
        const container = renderForActionDispatchTest(
            <DeviceListItem device={{ id: 'deleteMe', location: { lat: 3, lon: 7 } }} colorIndex={0} />,
        );

        const loginButton = getByTestId(container, 'deleteDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppDeleteDeviceRequest('deleteMe'));
    });
});
