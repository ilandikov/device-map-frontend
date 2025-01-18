import { fireEvent, getByTestId } from '@testing-library/react';
import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForActionDispatchTest, renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { mapAppDeleteDeviceRequest } from '../redux/MapAppAction';
import { DeviceListItem } from '../DeviceListItem';

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

describe('DeviceListItem snapshot test', () => {
    it('should match snapshot without delete button', () => {
        const component = renderForSnapshotTest(
            <DeviceListItem device={testDevice} colorIndex={0} showDeleteButton={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot without delete button', () => {
        const component = renderForSnapshotTest(
            <DeviceListItem device={testDevice} colorIndex={0} showDeleteButton={false} />,
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
            <DeviceListItem device={testDevice} colorIndex={0} showDeleteButton={true} />,
        );

        const loginButton = getByTestId(container, 'deleteDeviceButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, mapAppDeleteDeviceRequest('try to delete me'));
    });
});
