import React from 'react';
import { MapAppAddress } from './redux/MapAppState';
import './MarkerAddress.scss';

export function MarkerAddress(props: { address: MapAppAddress }) {
    return (
        <div className="marker-address">
            <p>{props.address.addressLine1}</p>
            <span>{props.address.addressLine2}</span>
        </div>
    );
}
