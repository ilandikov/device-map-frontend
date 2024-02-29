/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { AppHeader } from '../AppHeader/AppHeader';
import { LoginModal } from './LoginModal';

export default function MapApp() {
    return (
        <>
            <AppHeader />
            <div className="map-app-container">
                <LoginModal />
            </div>
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </>
    );
}
