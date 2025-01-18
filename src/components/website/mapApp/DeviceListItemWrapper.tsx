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
    if (approvals < 0) {
        return {
            leftShadowColorClass: 'create',
            rightShadowColorClass: 'create',
        };
    }

    switch (approvals) {
        case 0:
            return {
                leftShadowColorClass: 'created',
                rightShadowColorClass: 'created',
            };
        case 1:
            return {
                leftShadowColorClass: 'approving',
                rightShadowColorClass: 'approving',
            };
        case 2:
            return {
                leftShadowColorClass: 'approved',
                rightShadowColorClass: 'approved',
            };
        default:
            console.warn('DeviceListItem component: colorIndex mod 3 has been more than 4. Colors may be wrong.');
            return {
                leftShadowColorClass: 'create',
                rightShadowColorClass: 'create',
            };
    }
}
