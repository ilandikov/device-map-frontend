import React, { useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon, LeafletMouseEvent } from 'leaflet';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { useAppDispatch } from '../../../redux/store';
import { useMapAppState } from './redux/MapAppState';
import { mapAppSetLocationCoordinates } from './redux/MapAppAction';

export function useMarkerClickHandler() {
    const dispatch = useAppDispatch();
    const selectedMarkerLocation = useMapAppState().selectedMarker.location;

    return (event: LeafletMouseEvent) => {
        const alreadySelectedMarkerClicked =
            selectedMarkerLocation &&
            selectedMarkerLocation.lat === event.latlng.lat &&
            selectedMarkerLocation.lon === event.latlng.lng;
        if (alreadySelectedMarkerClicked) {
            return;
        }

        dispatch(mapAppSetLocationCoordinates({ lat: event.latlng.lat, lon: event.latlng.lng }));
    };
}

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

    const markerClickHandler = useMarkerClickHandler();

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
