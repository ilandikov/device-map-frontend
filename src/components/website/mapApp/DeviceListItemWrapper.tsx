import React from 'react';
import terminals from '../../../assets/images/Terminals.png';

export function DeviceListItemWrapper(props: { index: number | null; children: React.ReactNode }) {
    const { leftShadowColorClass, rightShadowColorClass } = getColorClassesForDeviceItemShadows(props.index);

    return (
        <div className="device-list-item-container">
            <div className={`device-list-item-shadow device-list-item-shadow-left ${leftShadowColorClass}`}></div>
            <div className={`device-list-item-shadow device-list-item-shadow-right ${rightShadowColorClass}`}></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">{props.children}</div>
        </div>
    );
}

function getColorClassesForDeviceItemShadows(index: number | null) {
    if (index === null) {
        return {
            leftShadowColorClass: 'device-list-create-device-item-shadow-left',
            rightShadowColorClass: 'device-list-create-device-item-shadow-right',
        };
    }

    switch (index % 3) {
        case 0:
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-first',
                rightShadowColorClass: 'device-list-item-shadow-right-first',
            };
        case 1:
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-second',
                rightShadowColorClass: 'device-list-item-shadow-right-second',
            };
        case 2:
            return {
                leftShadowColorClass: 'device-list-item-shadow-left-third',
                rightShadowColorClass: 'device-list-item-shadow-right-third',
            };
        default:
            console.warn('DeviceListItem component: index mod 3 has been more than 4. Colors may be wrong.');
            return {
                leftShadowColorClass: 'device-list-create-device-item-shadow-left',
                rightShadowColorClass: 'device-list-create-device-item-shadow-right',
            };
    }
}
