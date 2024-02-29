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
            <div className="login-container">
                <LoginModal />
            </div>
            <img className="login-map-image" src={mapImage} alt="map" />
        </>
    );
}
