/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';

export default function MapApp() {
    return (
        <div className="map-app-container">
            <MapAppHeader />
            <ProductDescription />
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
