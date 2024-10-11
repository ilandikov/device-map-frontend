import React from 'react';
import { Icon, LatLng } from 'leaflet';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { Marker } from 'react-leaflet';
import { useAppDispatch } from '../../../redux/store';
import { useMapAppState } from './redux/MapAppState';
import { mapAppClickDeviceMarker } from './redux/MapAppAction';

export function DeviceMarkers() {
    const dispatch = useAppDispatch();

    const deviceMarkerIcon = new Icon({
        className: 'map-marker',
        iconRetinaUrl: markerRetinaImage,
        iconSize: [25, 41],
        iconUrl: markerImage,
        shadowUrl: shadowImage,
        shadowSize: [41, 41],
    });

    const devices = useMapAppState().devices;

    return devices.map((device, index) => {
        const devicePosition = new LatLng(device.lat, device.lng);
        return (
            <Marker
                key={`DeviceMarker${index}`}
                icon={deviceMarkerIcon}
                position={devicePosition}
                eventHandlers={{
                    click: (event) => {
                        dispatch(mapAppClickDeviceMarker(event.latlng));
                    },
                }}
            />
        );
    });
}
