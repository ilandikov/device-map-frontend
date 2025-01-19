import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mapAppApproveDeviceRequest, mapAppDeleteDeviceRequest } from '../redux/MapAppAction';
import { DeviceListItem } from '../DeviceListItem';
import { DeleteButton } from '../DeleteButton';
import { ApproveButton } from '../ApproveButton';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

const testDevice: T22Device = {
    id: 'try to delete me',
    createdDate: '1704558741541',
    creatorID: 'device list test creator id',
    location: { lat: 3, lon: 7 },
};

describe('DeviceListItem snapshot tests', () => {
    it('should match snapshot created device with approve button and without delete button', () => {
        const component = renderForSnapshotTest(
            <DeviceListItem device={testDevice} approvals={0} createdByCurrentUser={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot validating device with approve button and without delete button', () => {
        const component = renderForSnapshotTest(
            <DeviceListItem device={testDevice} approvals={1} createdByCurrentUser={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot validated device without approve button and without delete button', () => {
        const component = renderForSnapshotTest(
            <DeviceListItem device={testDevice} approvals={2} createdByCurrentUser={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot created device without approval button and with delete button', () => {
        const component = renderForSnapshotTest(
            <DeviceListItem device={testDevice} approvals={0} createdByCurrentUser={true} />,
        );
        expect(component).toMatchSnapshot();
    });
});

describe('DeviceListItem action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should dispatch delete device request on delete device button click', () => {
        const container = renderForActionDispatchTest(<DeleteButton id={'try to delete me'} />);

        const loginButton = getByTestId(container, 'deleteDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppDeleteDeviceRequest('try to delete me'));
    });

    it('should dispatch approve request on approve device button click', () => {
        const container = renderForActionDispatchTest(<ApproveButton id={'try to delete me'} />);

        const loginButton = getByTestId(container, 'approveDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppApproveDeviceRequest('try to delete me'));
    });
});
