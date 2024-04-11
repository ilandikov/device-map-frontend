/* External dependencies */
import React from 'react';

/* Local dependencies */
import './MapApp.scss';
import { useSelector } from 'react-redux';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { RootState } from '../../../redux/store';
import { LoginModal } from '../login/LoginModal';
import { MapAppHeader } from './MapAppHeader';
import { ProductDescription } from './ProductDescription';
import { MapAppState, MapAppUsageStep } from './redux/MapAppReducer';

export default function MapApp() {
    const mapAppState: MapAppState = useSelector((state: RootState) => state.mapAppState);

    return (
        <div className="map-app-container">
            <MapAppHeader />
            {mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN && <ProductDescription />}
            {mapAppState.usageStep === MapAppUsageStep.USER_AUTHENTICATION && <LoginModal />}
            <img className="map-app-map-image" src={mapImage} alt="map" />
        </div>
    );
}
