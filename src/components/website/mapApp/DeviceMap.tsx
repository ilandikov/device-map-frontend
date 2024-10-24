import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng } from 'leaflet';
import React, { useEffect } from 'react';
import './DeviceMap.scss';
import { useAppDispatch } from '../../../redux/store';
import { UserLocationMarker } from './UserLocationMarker';
import { DeviceMarkers } from './DeviceMarkers';

export function DeviceMap() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch({ type: 'REMOTE_REQUEST', request: 'LIST_DEVICES' });
    }, []);

    return (
        <MapContainer
            className="device-map"
            center={typeof window !== 'undefined' ? new LatLng(42.876, 74.603) : undefined}
            scrollWheelZoom={false}
            zoom={17}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.com/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            <UserLocationMarker />
            <DeviceMarkers />
        </MapContainer>
    );
}
