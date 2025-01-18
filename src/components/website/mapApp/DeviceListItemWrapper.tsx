import React from 'react';
import terminals from '../../../assets/images/Terminals.png';

export function DeviceListItemWrapper(props: { approvals: number; children: React.ReactNode }) {
    const { leftShadowColorClass, rightShadowColorClass } = getShadowClassesByValidationStatus(props.approvals);

    return (
        <div className="device-list-item-container">
            <div className={`device-list-item-shadow device-list-item-shadow-left ${leftShadowColorClass}`}></div>
            <div className={`device-list-item-shadow device-list-item-shadow-right ${rightShadowColorClass}`}></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">{props.children}</div>
        </div>
    );
}

function getShadowClassesByValidationStatus(approvals: number) {
    if (approvals < 0) {
        return {
            leftShadowColorClass: 'device-list-item-create-shadow-left',
            rightShadowColorClass: 'device-list-item-create-shadow-right',
        };
    }

    switch (approvals) {
        case 0:
            return {
                leftShadowColorClass: 'device-list-item-created-shadow-left',
                rightShadowColorClass: 'device-list-item-created-shadow-right',
            };
        case 1:
            return {
                leftShadowColorClass: 'device-list-item-approving-shadow-left',
                rightShadowColorClass: 'device-list-item-approving-shadow-right',
            };
        case 2:
            return {
                leftShadowColorClass: 'device-list-item-approved-shadow-left',
                rightShadowColorClass: 'device-list-item-approved-shadow-right',
            };
        default:
            console.warn('DeviceListItem component: colorIndex mod 3 has been more than 4. Colors may be wrong.');
            return {
                leftShadowColorClass: 'device-list-item-create-shadow-left',
                rightShadowColorClass: 'device-list-item-create-shadow-right',
            };
    }
}
