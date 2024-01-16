/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './phone.css';

export default function Phone() {
    return (
        <div>
            <div>
                <p className='header'>Исслейдуте</p>
                <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
            </div>
            <StaticImage src="./Phone.png" alt="map" />
        </div>
    );
}
