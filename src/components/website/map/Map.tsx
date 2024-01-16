/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';

/* Local dependencies */
import './map.css';

export default function Map() {
    return (
        <div className="map-background">
            <div className="frame-column">
                <StaticImage src="./Frame.png" alt="frame" />
                <p className="frame-text">Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
            </div>
        </div>
    );
}
