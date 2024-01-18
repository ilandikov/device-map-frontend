/* External dependencies */
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

/* Local dependencies */
import './map.css';

export default function Map() {
    return (
        <section className="map-background">
            <div className="map-content-container">
                <div className='map-brand'>
                    <StaticImage src="../../../assets/images/Logo.svg" alt="logo-with-brand" />
                    <p className='map-brand-text'>Карта</p>
                </div>
                <p className="map-text">Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
                <div className='map-links'>
                    <StaticImage src="../../../assets/images/WebApp.svg" alt="map-links" />
                    <StaticImage src="../../../assets/images/GooglePlay.svg" alt="map-links" />
                    <StaticImage src="../../../assets/images/AppStore.svg" alt="map-links" />
                </div>
            </div>
        </section>
    );
}
