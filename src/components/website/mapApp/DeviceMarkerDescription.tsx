import React, { useEffect } from 'react';
import home from '../../../assets/images/Home.png';
import { useAppDispatch } from '../../../redux/store';
import { useMapAppState } from './redux/MapAppState';
import './DeviceMarkerDescription.scss';
import { mapAppGetLocationAddress } from './redux/MapAppAction';
import { MarkerAddressLoader } from './MarkerAddressLoader';
import { MarkerAddress } from './MarkerAddress';
import { DeviceList } from './DeviceList';

export function DeviceMarkerDescription() {
    const dispatch = useAppDispatch();

    const selectedMarker = useMapAppState().selectedMarker;
    const waitingForAddress = selectedMarker.address === null;

    useEffect(() => {
        dispatch(mapAppGetLocationAddress(selectedMarker.location));
    }, [selectedMarker.location]);

    return (
        <div className="device-marker-description-window">
            <div className="marker-address-container">
                <img src={home} className="marker-address-image" alt="marker-address-image" />
                {waitingForAddress ? <MarkerAddressLoader /> : <MarkerAddress address={selectedMarker.address} />}
            </div>
            <DeviceList />
        </div>
    );
}
