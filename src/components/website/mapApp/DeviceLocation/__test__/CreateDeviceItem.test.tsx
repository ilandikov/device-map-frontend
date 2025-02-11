import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest } from '../../../../../../tests/utils/RenderingHelpers';
import { CreateDeviceItem } from '../CreateDeviceItem';
import { mapAppButtonClick } from '../../redux/MapAppAction';
import { deviceListRequest } from '../../redux/DeviceAction';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

describe('Create Device Item action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should dispatch create device action on create device button click', () => {
        mockMapAppState({ currentUserID: 'i can create a device' });
        const container = renderForActionDispatchTest(<CreateDeviceItem />);

        const loginButton = getByTestId(container, 'createDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, deviceListRequest());
    });

    it('should dispatch show login modal on create account or login button click', () => {
        mockMapAppState({ currentUserID: null });
        const container = renderForActionDispatchTest(<CreateDeviceItem />);

        const loginButton = getByTestId(container, 'deviceCreateAccountOrLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppButtonClick());
    });
});
