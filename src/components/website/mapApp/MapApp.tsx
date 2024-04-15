/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const showProductDescription = mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN;
    const showLoginModal = mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION;

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {showProductDescription && <ProductDescription />}
            {showLoginModal && <LoginModal />}
            <MapContainer className="map-app-map" center={new LatLng(42.876, 74.603)} scrollWheelZoom={false} zoom={17}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.com/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}
