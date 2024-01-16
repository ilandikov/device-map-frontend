/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './logo.css';

export default function Logo() {
    return (
        <div className='logo-container'>
            <StaticImage className="top-logo" src="./Logo.png" alt="logo" />
        </div>
      );
}
