import React, { useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import markerImage from 'leaflet/dist/images/marker-icon.png';
import markerRetinaImage from 'leaflet/dist/images/marker-icon-2x.png';
import shadowImage from 'leaflet/dist/images/marker-shadow.png';

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
    const [loadingPosition, setLoadingPosition] = React.useState(false);

    const map = useMapEvents({
        locationfound(locationEvent) {
            setPosition(locationEvent.latlng);
            map.flyTo(locationEvent.latlng, map.getZoom());
            map.on('zoomend', function () {
                setLoadingPosition(false);
            });
        },
    });

    useEffect(() => {
        map.locate();
        setLoadingPosition(true);
    }, []);

    return (
        <>
            {loadingPosition && <div className="thisIsTheLoader"></div>}
            {position && (
                <Marker icon={markerIcon} position={position}>
                    <Popup>You are here</Popup>
                </Marker>
            )}
        </>
    );
}
