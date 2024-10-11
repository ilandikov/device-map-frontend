import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import React from 'react';
import './DeviceMap.scss';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { UserLocationMarker } from './UserLocationMarker';
import { useMapAppState } from './redux/MapAppState';
import { DeviceMarkers } from './DeviceMarkers';

function devicesShowList(lat: number, lng: number) {}

export function DeviceMap() {
    const deviceMarkerIcon = new Icon({
        className: 'map-marker',
        iconRetinaUrl: markerRetinaImage,
        iconSize: [25, 41],
        iconUrl: markerImage,
        shadowUrl: shadowImage,
        shadowSize: [41, 41],
    });

    const devices = useMapAppState().devices;

    const deviceMarkers = devices.map((device, index) => {
        const devicePosition = new LatLng(device.lat, device.lng);
        return (
            <Marker
                key={`DeviceMarker${index}`}
                icon={deviceMarkerIcon}
                position={devicePosition}
                eventHandlers={{
                    click: (event) => {
                        devicesShowList(event.latlng.lat, event.latlng.lng);
                    },
                }}
            />
        );
    });

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
            <DeviceMarkers elements={deviceMarkers} />
        </MapContainer>
    );
}
