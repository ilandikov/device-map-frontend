/* External dependencies */
import React from 'react';
import { Link } from 'gatsby';

/* Local dependencies */
import './Map.scss';
import Logo from '/src/assets/images/Logo.svg';
import WebApp from '/src/assets/images/WebApp.svg';
import GooglePlay from '/src/assets/images/GooglePlayOpaque.svg';
import AppStore from '/src/assets/images/AppStoreOpaque.svg';
import Kyrgyzstan from '/src/assets/video/Kyrgyzstan.mp4';

export default function Map() {
    return (
        <section className="map-background">
            <div className="map-background-video">
                <video autoPlay loop muted>
                    <source src={Kyrgyzstan} type="video/mp4" className="map-background-video-source" />
                </video>
            </div>
            <div className="map-content-container">
                <div className="map-brand">
                    <img src={Logo} alt="logo-with-brand" />
                    <p className="map-brand-text">Карта</p>
                </div>
                <p className="map-text">
                    Карта терминалов от Finik, исследуйте,
                    <br /> отмечайте и зарабатывайте баллы
                </p>
                <div className="map-links">
                    <Link to="/webapp">
                        <img src={WebApp} alt="map-links-webapp" />
                    </Link>
                    <img src={GooglePlay} alt="map-links-google-play" />
                    <img src={AppStore} alt="map-links-apple-store" />
                </div>
            </div>
        </section>
    );
}
