import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest } from '../../../../../../tests/utils/RenderingHelpers';
import { CreateDeviceItem } from '../CreateDeviceItem';
import {
    MapAppButton,
    MapAppRemoteRequestType,
    mapAppButtonClick,
    mapAppRemoteRequest,
} from '../../redux/MapAppAction';
import { MapAppUsageStep } from '../../redux/MapAppState';

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
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
        const container = renderForActionDispatchTest(<CreateDeviceItem />);

        const loginButton = getByTestId(container, 'createDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppRemoteRequest(MapAppRemoteRequestType.CREATE_DEVICE));
    });

    it('should dispatch show login modal on create account or login button click', () => {
        // TODO this should reference some field in authentication state
        mockMapAppState({ usageStep: MapAppUsageStep.HOME_SCREEN });
        const container = renderForActionDispatchTest(<CreateDeviceItem />);

        const loginButton = getByTestId(container, 'deviceCreateAccountOrLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppButtonClick(MapAppButton.LOGIN));
    });
});
