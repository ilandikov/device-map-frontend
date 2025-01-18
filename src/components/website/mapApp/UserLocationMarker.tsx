import React, { useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';
import { useMarkerClickHandler } from './UseMarkerClickHandler';

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
            <Marker
                icon={markerIcon}
                position={position}
                eventHandlers={{
                    click: markerClickHandler,
                }}
            >
                <Popup>You are here</Popup>
            </Marker>
        )
    );
}
