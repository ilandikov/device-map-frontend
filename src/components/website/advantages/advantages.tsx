/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';

function AdvantageFullBlock() {
    return(
        <div className='advantage-block-full'>
            <StaticImage src="./iPhone 14.png" alt="logo" />
            <div className='advantage-block-text'>
                <p className='advantage-block-text-header'>Играй.</p>
                <p>Увлекательная игра</p>
            </div>
        </div>
    );
}
export default function Advantages() {
    return (
        <div className='advantages-container'>
            {AdvantageFullBlock()}
        </div>
      );
}
