import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../../redux/store';
import home from '../../../../assets/images/Home.png';
import { useMapAppState } from '../redux/MapAppState';
import { mapAppGetLocationAddress } from '../redux/MapAppAction';
import { LocationAddressLoader } from './LocationAddressLoader';
import './LocationAddress.scss';

export function LocationAddress() {
    const selectedMarker = useMapAppState().selectedMarker;
    const waitingForAddress = selectedMarker.address === null;

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(mapAppGetLocationAddress(selectedMarker.location));
    }, [selectedMarker.location]);

    return (
        <div className="location-address-container">
            <img src={home} className="location-address-image" alt="location-address-image" />
            {waitingForAddress ? (
                <LocationAddressLoader />
            ) : (
                <div className="location-address">
                    <p>{selectedMarker.address.addressLine1}</p>
                    <span>{selectedMarker.address.addressLine2}</span>
                </div>
            )}
        </div>
    );
}
