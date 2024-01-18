/* External dependencies */
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

/* Local dependencies */
import './map.css';

export default function Map() {
    return (
        <section className="map-background">
            <div className="frame-column">
                <div className='map-brand'>
                    <StaticImage src="../../../assets/images/Logo.svg" alt="logo-with-brand" />
                    <p className='map-brand-text'>Карта</p>
                </div>
                <p className="frame-text">Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
                <StaticImage src="../../../assets/images/Links.png" alt="links" />
            </div>
        </section>
    );
}
