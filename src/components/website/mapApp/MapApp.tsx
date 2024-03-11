/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';

export default function MapApp() {
    return (
        <div className="map-app-container">
            <MapAppHeader />
            <ProductDescription />
            <LoginModal />
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
