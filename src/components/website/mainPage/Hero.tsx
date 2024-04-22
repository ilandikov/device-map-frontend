/* External dependencies */
import React from 'react';
import { Link } from 'gatsby';

/* Local dependencies */
import './Hero.scss';
import Logo from '/src/assets/images/Logo.svg';
import WebApp from '/src/assets/images/WebApp.svg';
import GooglePlay from '/src/assets/images/GooglePlayOpaque.svg';
import AppStore from '/src/assets/images/AppStoreOpaque.svg';
import Kyrgyzstan from '/src/assets/video/Kyrgyzstan.mp4';

export default function Hero() {
    return (
        <section className="hero-container">
            <div className="hero-background-video">
                <video autoPlay loop muted>
                    <source src={Kyrgyzstan} type="video/mp4" className="map-background-video-source" />
                </video>
            </div>
            <div className="hero-content-container">
                <div className="hero-brand">
                    <img src={Logo} alt="logo-with-brand" />
                    <p className="hero-brand-text">Карта</p>
                </div>
                <p className="hero-text">
                    Карта терминалов от Finik, исследуйте,
                    <br /> отмечайте и зарабатывайте баллы
                </p>
                <div className="hero-links">
                    <Link to="/webapp">
                        <img src={WebApp} alt="hero-links-webapp" />
                    </Link>
                    <img src={GooglePlay} alt="hero-links-google-play" />
                    <img src={AppStore} alt="hero-links-apple-store" />
                </div>
            </div>
        </section>
    );
}
