import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../../redux/store';
import home from '../../../../assets/images/Home.png';
import { useMapAppState } from '../redux/MapAppState';
import { selectedMarkerGetAddress } from '../redux/MapAppAction';
import { LocationAddressLoader } from './LocationAddressLoader';
import './LocationAddress.scss';

export function LocationAddress() {
    const { selectedMarker } = useMapAppState();
    const waitingForAddress = selectedMarker.address === null;

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(selectedMarkerGetAddress(selectedMarker.location));
    }, [selectedMarker.location]);

    return (
        <div className="location-address-container">
            <img src={home} className="location-address-image" alt="location-address-image" />
            {waitingForAddress ? (
                <LocationAddressLoader />
            ) : (
                <div className="location-address">
                    <p>{selectedMarker.address.line1}</p>
                    <span>{selectedMarker.address.line2}</span>
                </div>
            )}
        </div>
    );
}
