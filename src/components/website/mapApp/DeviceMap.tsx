import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import React from 'react';
import './DeviceMap.scss';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { UserLocationMarker } from './UserLocationMarker';

export function DeviceMap() {
    const deviceMarkerIcon = new Icon({
        className: 'map-marker',
        iconRetinaUrl: markerRetinaImage,
        iconSize: [25, 41],
        iconUrl: markerImage,
        shadowUrl: shadowImage,
        shadowSize: [41, 41],
    });

    const device1 = {
        lat: 42.85862508449081,
        lng: 74.6085298061371,
    };

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
            <Marker icon={deviceMarkerIcon} position={new LatLng(device1.lat, device1.lng)} />
        </MapContainer>
    );
}
