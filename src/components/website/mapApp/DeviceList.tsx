import React from 'react';
import { Device } from './redux/MapAppState';
import { DeviceListItem } from './DeviceListItem';
import './DeviceList.scss';

export function DeviceList(props: { devices: Device[] }) {
    return (
        <div className="device-list-container">
            {props.devices.map((device) => {
                return <DeviceListItem device={device} />;
            })}
        </div>
    );
}
