/* External dependencies */
import React, { CSSProperties, ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';

function AdvantageFullBlock(header: string, description: string, textColor: string, backgroundColor: string, image: ReactElement) {
    const blockCSS = {
        backgroundColor: backgroundColor,
        color: textColor,
    };

    return(
        <div className='advantage-block-full' style={blockCSS}>
            {image}
            <div className='advantage-block-text'>
                <p className='advantage-block-text-header'>{header}.</p>
                <p>{description}</p>
            </div>
        </div>
    );
}

function AdvantageHalfBlock() {
    return(
        <div className='advantage-block-half'>
        </div>
    );
}
export default function Advantages() {
    return (
        <div className='advantages-container'>
            {AdvantageFullBlock('Играй','Увлекательная игра', '#000000', '#CBEA5E', <StaticImage src="./iPhone 14.png" alt="advantage" />)}
            {AdvantageHalfBlock()}
            {AdvantageFullBlock('Везде','На всех платформах', '#FFFFFF', '#0066FF', <StaticImage src="./MacBook Pro 16.png" alt="advantage" />)}
            {AdvantageFullBlock('Оглянись','Терминалы везде', '#000000', '#FFFFFF', <StaticImage src="./Terminal.png" alt="advantage" />)}
        </div>
      );
}
