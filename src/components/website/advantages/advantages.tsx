/* External dependencies */
import React, { CSSProperties, ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';

function AdvantageFullBlock(header: string, description: string, textColor: string, backgroundColor: string, image: ReactElement) {
    const textBlockCSS = {
        backgroundColor: backgroundColor,
        color: textColor,
    };

    return(
        <div className='advantage-block advantage-block-radius' style={textBlockCSS}>
            <div className='advantage-half-block'>
                {image}
            </div>
            <div className='advantage-half-block'>
                <div className='advantage-text'>
                    <p className='advantage-text-header'>{header}.</p>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

function AdvantageGiftBlock() {
    const textBlockCSS = {
        color: '#000000',
        backgroundColor: '#FFFFFF',
    };

    return(
        <div className='advantage-block'>
            <div className='advantage-half-block advantage-block-radius' style={textBlockCSS}>
                <div className='advantage-text advantage-half-block-text'>
                    <p className='advantage-text-header'>Обменивай.</p>
                    <p>Получай подарки</p>
                </div>
            </div>
            <div className='advantage-half-block'>
                <StaticImage src="./Gift.png" alt="advantage" />
            </div>
        </div>
    );
}

function TerminalImage() {
    const terminalImageContainerCSS: React.CSSProperties = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    };
    
    return(
        <div style={terminalImageContainerCSS}>
            <StaticImage src="./Terminal.png" alt="advantage" />
        </div>
    )
}

export default function Advantages() {
    return (
        <div className='advantages-container'>
            {AdvantageFullBlock('Играй','Увлекательная игра', '#000000', '#CBEA5E', <StaticImage src="./iPhone 14.png" alt="advantage" />)}
            {AdvantageGiftBlock()}
            {AdvantageFullBlock('Везде','На всех платформах', '#FFFFFF', '#0066FF', <StaticImage src="./MacBook Pro 16.png" alt="advantage" />)}
            {AdvantageFullBlock('Оглянись','Терминалы везде', '#000000', '#FFFFFF', TerminalImage())}
        </div>
      );
}
