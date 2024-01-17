/* External dependencies */
import React, { CSSProperties, ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';

function AdvantageFullBlock(image: ReactElement, header: string, description: string) {
    return(
        <div className='advantage-block-full'>
            {image}
            <div className='advantage-block-text'>
                <p className='advantage-block-text-header'>{header}</p>
                <p>{description}</p>
            </div>
        </div>
    );
}
export default function Advantages() {
    return (
        <div className='advantages-container'>
            {AdvantageFullBlock(<StaticImage src="./iPhone 14.png" alt="advantage" />, 'Играй.','Увлекательная игра')}
        </div>
      );
}
