import React from 'react';
import { Icon, LatLng } from 'leaflet';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { Marker } from 'react-leaflet';
import { useMapAppState } from './redux/MapAppState';
import { useMarkerClickHandler } from './UserLocationMarker';

export function DeviceMarkers() {
    const deviceMarkerIcon = new Icon({
        className: 'map-marker',
        iconRetinaUrl: markerRetinaImage,
        iconSize: [25, 41],
        iconUrl: markerImage,
        shadowUrl: shadowImage,
        shadowSize: [41, 41],
    });

    const markerClickHandler = useMarkerClickHandler();

    const devices = useMapAppState().devices;

    return devices.map((device, index) => {
        const devicePosition = new LatLng(device.location.lat, device.location.lon);

        return (
            <Marker
                key={`DeviceMarker${index}`}
                icon={deviceMarkerIcon}
                position={devicePosition}
                eventHandlers={{
                    click: markerClickHandler,
                }}
            />
        );
    });
}
