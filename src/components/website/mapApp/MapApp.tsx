/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import { useSelector } from 'react-redux';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { RootState } from '../../../redux/store';
import { LoginModal, UserAuthState } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppState } from './MapAppReducer';

export default function MapApp() {
    const mapAppState: MapAppState = useSelector((state: RootState) => state.mapAppState);
    return (
        <div className="map-app-container">
            <MapAppHeader />
            {mapAppState.userAuthState === UserAuthState.PRODUCT_DESCRIPTION && <ProductDescription />}
            {mapAppState.userAuthState === UserAuthState.WELCOME && <LoginModal />}
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
