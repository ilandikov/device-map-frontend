import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { mockDispatch, mockMapAppState, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { renderForSnapshotTest } from '../../../../../tests/utils/RenderingHelpers';
import { DeviceItem } from '../DeviceLocation/DeviceItem';
import { MapAppUsageStep } from '../redux/MapAppState';

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

describe('DeviceItem snapshot tests - logged in user', () => {
    it('should match snapshot - created device with approve button and without delete button', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
        const component = renderForSnapshotTest(
            <DeviceItem device={{ ...testDevice, approvals: 0 }} createdByCurrentUser={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot - validating device with approve button and without delete button', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
        const component = renderForSnapshotTest(
            <DeviceItem device={{ ...testDevice, approvals: 1 }} createdByCurrentUser={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot - validated device without approve button and without delete button', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
        const component = renderForSnapshotTest(
            <DeviceItem device={{ ...testDevice, approvals: 2 }} createdByCurrentUser={false} />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should match snapshot - created device without approval button and with delete button', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.DEVICE_MANAGEMENT });
        const component = renderForSnapshotTest(<DeviceItem device={testDevice} createdByCurrentUser={true} />);
        expect(component).toMatchSnapshot();
    });
});

describe('DeviceItem snapshot tests - anonymous user', () => {
    it('should match snapshot - created device without approval button and without delete button', () => {
        mockMapAppState({ usageStep: MapAppUsageStep.HOME_SCREEN });
        const component = renderForSnapshotTest(<DeviceItem device={testDevice} createdByCurrentUser={false} />);
        expect(component).toMatchSnapshot();
    });
});
