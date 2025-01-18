import React, { useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { useAppDispatch } from '../../../redux/store';
import { buildLocationMarkerClickHandler } from './DeviceMarkers';
import { useMapAppState } from './redux/MapAppState';

export function UserLocationMarker() {
    const markerIcon = new Icon({
        className: 'map-marker',
        iconRetinaUrl: markerRetinaImage,
        iconSize: [25, 41],
        iconUrl: markerImage,
        shadowUrl: shadowImage,
        shadowSize: [41, 41],
    });

    const [position, setPosition] = React.useState(null);

    const dispatch = useAppDispatch();
    const selectedMarkerLocation = useMapAppState().selectedMarker.location;
    const markerClickHandler = buildLocationMarkerClickHandler(selectedMarkerLocation, dispatch);

    const map = useMapEvents({
        locationfound(locationEvent) {
            setPosition(locationEvent.latlng);
            map.flyTo(locationEvent.latlng, map.getZoom());
        },
        click(locationEvent) {
            setPosition(locationEvent.latlng);
            markerClickHandler(locationEvent);
        },
    });

    useEffect(() => {
        map.locate();
    }, []);

    return (
        position && (
            <Marker icon={markerIcon} position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
    );
}
