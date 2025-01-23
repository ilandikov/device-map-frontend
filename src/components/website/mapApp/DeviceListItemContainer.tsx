import React from 'react';
import terminals from '../../../assets/images/Terminals.png';

export function DeviceListItemContainer(props: {
    deviceApprovalStatus: DeviceApprovalStatus;
    children: React.ReactNode;
}) {
    return (
        <div className="device-list-item-container">
            <div
                className={`device-list-item-shadow device-list-item-shadow-left device-list-item-${props.deviceApprovalStatus}-shadow-left`}
            ></div>
            <div
                className={`device-list-item-shadow device-list-item-shadow-right device-list-item-${props.deviceApprovalStatus}-shadow-right`}
            ></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">{props.children}</div>
        </div>
    );
}

type DeviceApprovalStatus = 'create' | 'created' | 'approving' | 'approved';

export function getDeviceApprovalStatus(approvals: number): DeviceApprovalStatus {
    switch (true) {
        case approvals < 0:
            return 'create';
        case approvals === 0:
            return 'created';
        case approvals === 1:
            return 'approving';
        case approvals >= 2:
            return 'approved';
        default:
            throw new Error(`Unknown approval count: ${approvals}`);
    }
}
