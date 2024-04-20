/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import 'leaflet/dist/leaflet.css';
import { UserLocationMarker } from './UserLocationMarker';

export default function MapApp() {
    const mapAppState = useMapAppState();

    const showProductDescription = mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN;
    const showLoginModal = mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION;

    const latLng = typeof window !== 'undefined' ? new LatLng(42.876, 74.603) : undefined;

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {showProductDescription && <ProductDescription />}
            {showLoginModal && <LoginModal />}
            <MapContainer className="map-app-map" center={latLng} scrollWheelZoom={false} zoom={17} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.com/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
                <UserLocationMarker />
            </MapContainer>
        </div>
    );
}
