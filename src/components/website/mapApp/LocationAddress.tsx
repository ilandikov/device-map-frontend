import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../redux/store';
import home from '../../../assets/images/Home.png';
import { useMapAppState } from './redux/MapAppState';
import { mapAppGetLocationAddress } from './redux/MapAppAction';
import { MarkerAddressLoader } from './MarkerAddressLoader';
import './MarkerAddress.scss';

export function LocationAddress() {
    const selectedMarker = useMapAppState().selectedMarker;
    const waitingForAddress = selectedMarker.address === null;

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(mapAppGetLocationAddress(selectedMarker.location));
    }, [selectedMarker.location]);

    return (
        <div className="marker-address-container">
            <img src={home} className="marker-address-image" alt="marker-address-image" />
            {waitingForAddress ? (
                <MarkerAddressLoader />
            ) : (
                <div className="marker-address">
                    <p>{selectedMarker.address.addressLine1}</p>
                    <span>{selectedMarker.address.addressLine2}</span>
                </div>
            )}
        </div>
    );
}
