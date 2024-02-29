/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';

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
