/* External dependencies */
import React, { CSSProperties, ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';

function AdvantageFullBlock(header: string, description: string, image: ReactElement) {
    const backgroundColorCSS = {
        backgroundColor: '#CBEA5E',
    };

    return(
        <div className='advantage-block-full' style={backgroundColorCSS}>
            {image}
            <div className='advantage-block-text'>
                <p className='advantage-block-text-header'>{header}.</p>
                <p>{description}</p>
            </div>
        </div>
    );
}
export default function Advantages() {
    return (
        <div className='advantages-container'>
            {AdvantageFullBlock('Играй','Увлекательная игра', <StaticImage src="./iPhone 14.png" alt="advantage" />)}
        </div>
      );
}
