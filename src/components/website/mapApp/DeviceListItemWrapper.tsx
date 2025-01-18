import React from 'react';
import terminals from '../../../assets/images/Terminals.png';

export function DeviceListItemWrapper(props: { approvals: number; children: React.ReactNode }) {
    const { leftShadowColorClass, rightShadowColorClass } = getShadowClassesByValidationStatus(props.approvals);

    return (
        <div className="device-list-item-container">
            <div
                className={`device-list-item-shadow device-list-item-shadow-left device-list-item-${leftShadowColorClass}-shadow-left`}
            ></div>
            <div
                className={`device-list-item-shadow device-list-item-shadow-right device-list-item-${rightShadowColorClass}-shadow-right`}
            ></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">{props.children}</div>
        </div>
    );
}

function getShadowClassesByValidationStatus(approvals: number) {
    switch (true) {
        case approvals < 0:
            return { leftShadowColorClass: 'create', rightShadowColorClass: 'create' };
        case approvals === 0:
            return { leftShadowColorClass: 'created', rightShadowColorClass: 'created' };
        case approvals === 1:
            return { leftShadowColorClass: 'approving', rightShadowColorClass: 'approving' };
        case approvals >= 2:
            return { leftShadowColorClass: 'approved', rightShadowColorClass: 'approved' };
        default:
            throw new Error(`Unknown approval count: ${approvals}`);
    }
}
