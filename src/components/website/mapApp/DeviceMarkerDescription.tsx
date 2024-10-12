import React, { useEffect } from 'react';
import home from '../../../assets/images/Home.png';
import { useAppDispatch } from '../../../redux/store';
import { useMapAppState } from './redux/MapAppState';
import './DeviceMarkerDescription.scss';
import { DeviceListItem } from './DeviceListItem';
import { mapAppGetLocationAddress } from './redux/MapAppAction';
import { MarkerAddressLoader } from './MarkerAddressLoader';
import { MarkerAddress } from './MarkerAddress';

export function DeviceMarkerDescription() {
    const dispatch = useAppDispatch();

    const mapAppState = useMapAppState();
    const devices = mapAppState.devices;
    const selectedMarker = mapAppState.selectedMarker;
    const waitingForAddress = selectedMarker.address === null;

    useEffect(() => {
        dispatch(mapAppGetLocationAddress(selectedMarker.location));
    }, [selectedMarker.location]);

    const devicesAtSelectedMarkerLocation = devices.filter((device) => {
        return (
            device.location.lat === selectedMarker.location.lat && device.location.lng === selectedMarker.location.lng
        );
    });

    const deviceListItems = devicesAtSelectedMarkerLocation.map((device) => {
        return <DeviceListItem device={device} />;
    });

    return (
        <div className="device-marker-description-window">
            <div className="marker-address-container">
                <img src={home} className="marker-address-image" alt="marker-address-image" />
                {waitingForAddress ? <MarkerAddressLoader /> : <MarkerAddress address={selectedMarker.address} />}
            </div>
            <div className="device-list-container">{deviceListItems}</div>
        </div>
    );
}
