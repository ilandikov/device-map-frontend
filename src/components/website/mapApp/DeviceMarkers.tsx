import React from 'react';
import { Icon, LatLng, LeafletMouseEvent } from 'leaflet';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { Marker } from 'react-leaflet';
import { useAppDispatch } from '../../../redux/store';
import { useMapAppState } from './redux/MapAppState';
import { mapAppSetLocationCoordinates } from './redux/MapAppAction';

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

    const selectedMarkerLocation = useMapAppState().selectedMarker.location;
    const markerClickHandler = (event: LeafletMouseEvent) => {
        const alreadySelectedMarkerClicked =
            selectedMarkerLocation &&
            selectedMarkerLocation.lat === event.latlng.lat &&
            selectedMarkerLocation.lon === event.latlng.lng;
        if (alreadySelectedMarkerClicked) {
            return;
        }

        dispatch(mapAppSetLocationCoordinates({ lat: event.latlng.lat, lon: event.latlng.lng }));
    };

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
