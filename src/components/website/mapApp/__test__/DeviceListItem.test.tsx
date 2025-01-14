import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mapAppDeleteDeviceRequest } from '../redux/MapAppAction';
import { DeviceListItem } from '../DeviceListItem';
import { AuthenticationStep } from '../../login/redux/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('DeviceListItem snapshot test', () => {
    it('should match snapshot when user is not authenticated', () => {
        mockAuthenticationState({});
        const component = renderForSnapshotTest(
            <DeviceListItem
                device={{ id: 'i should render without delete button', location: { lat: 3, lon: 7 } }}
                colorIndex={0}
            />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot when user is authenticated, but not the creator of the device', () => {
        mockAuthenticationState({
            step: AuthenticationStep.LOGGED_IN,
            id: 'i should render without delete button too',
        });
        const component = renderForSnapshotTest(
            <DeviceListItem
                device={{ id: 'not matching with id in authentication state', location: { lat: 3, lon: 7 } }}
                colorIndex={0}
            />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
        mockAuthenticationState({ step: AuthenticationStep.LOGGED_IN, id: 'i should render with delete button' });
        const component = renderForSnapshotTest(
            <DeviceListItem
                device={{ id: 'i should render with delete button', location: { lat: 3, lon: 7 } }}
                colorIndex={0}
            />,
        );
        expect(component).toMatchSnapshot();
    });
});

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
