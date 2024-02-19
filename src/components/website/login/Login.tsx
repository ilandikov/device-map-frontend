/* External dependencies */
import React from 'react';

/* Local dependencies */
import './Login.scss';
import mapImage from '../../../assets/images/GoogleMaps.png';
import { LoginHeader } from './LoginHeader';
import { LoginModal } from './LoginModal';

export default function Login() {
    return (
        <>
            <LoginHeader />
            <div className="login-container">
                <div className="login-window">
                    <div className="login-window-content-container">
                        <LoginModal />
                    </div>
                </div>
            </div>
            <img className="login-map-image" src={mapImage} alt="map" />
        </>
    );
}
