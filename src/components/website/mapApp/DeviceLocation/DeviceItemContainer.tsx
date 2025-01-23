import React from 'react';
import terminals from '../../../../assets/images/Terminals.png';
import { DeviceItemType } from './DeviceItemType';

export function DeviceItemContainer(props: { deviceItemType: DeviceItemType; children: React.ReactNode }) {
    return (
        <div className="device-list-item-container">
            <div
                className={`device-list-item-shadow device-list-item-shadow-left device-list-item-${props.deviceItemType}-shadow-left`}
            ></div>
            <div
                className={`device-list-item-shadow device-list-item-shadow-right device-list-item-${props.deviceItemType}-shadow-right`}
            ></div>
            <img src={terminals} className="device-list-item-image" alt="device-list-item-image" />
            <div className="device-list-item">{props.children}</div>
        </div>
    );
}
