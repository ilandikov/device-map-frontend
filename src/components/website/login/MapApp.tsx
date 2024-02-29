/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { MapAppHeader } from '../mapApp/MapAppHeader';
import { LoginModal } from './LoginModal';

export default function MapApp() {
    return (
        <>
            <MapAppHeader />
            <div className="map-app-container">
                <LoginModal />
            </div>
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </>
    );
}
