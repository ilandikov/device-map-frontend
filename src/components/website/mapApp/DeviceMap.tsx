import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng } from 'leaflet';
import React from 'react';
import { UserLocationMarker } from './UserLocationMarker';
import './DeviceMap.scss';

export function DeviceMap() {
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
        </MapContainer>
    );
}
