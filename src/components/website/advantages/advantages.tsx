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
                <div className='advantage-text-container advantage-text advantage-text'>
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
                <div className='advantage-text-container advantage-text advantage-half-block-text'>
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

function AdvantageLocationBlock() {
    const textBlockCSS = {
        color: '#000000',
        backgroundColor: '#FFFFFF',
    };
    
    const imageCSS = {
        width: 'auto',
    }

    return(
        <div className='advantage-block'>
            <div className='advantage-half-block'>
                <StaticImage src="./Location.png" alt="advantage" style={imageCSS}/>
            </div>
            <div className='advantage-half-block advantage-block-radius' style={textBlockCSS}>
                <div className='advantage-text-container advantage-text advantage-half-block-text'>
                    <p className='advantage-text-header'>Отмечай.</p>
                    <p>Мы поставим терминал</p>
                </div>
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

function AdvantageMapBlock() {
    const textContainerCSS: React.CSSProperties = {
        color: '#ffffff',
        textAlign: 'center',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',  
    };

    const textBlockCSS: React.CSSProperties = {
        color: '#ffffff',
        textAlign: 'center',        
    };

    const shadowsCSS: React.CSSProperties = {
        marginTop: '50px',
        width: '1200px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        position: 'absolute',
    }

    return(
        <div className='advantage-block advantages-block-with-background' style={textContainerCSS}>
            <div className='advantage-text' style={textBlockCSS}>
                <p className='advantage-text-header'>Изучай.</p>
                <p>Уникальная карта</p>
            </div>
            <div style={shadowsCSS}>
                <StaticImage src="./ShadowMapLeft.png" alt="advantage" />
                <StaticImage src="./ShadowMapRight.png" alt="advantage" />
            </div>
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
            {AdvantageLocationBlock()}
            {AdvantageMapBlock()}
        </div>
      );
}
