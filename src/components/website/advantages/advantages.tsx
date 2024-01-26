/* External dependencies */
import React, { ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';
import { prop } from 'cheerio/lib/api/attributes';

type AdvantageBlockProperties = {
    header: string,
    description: string,
    textColor: string,
    backgroundColor: string,
    image: any,
    imageContainerStyle?: string,
};

type NewBlockProperties = {
    color: string,
    backgroundColor: string,
}

export default function Advantages() {
    const phoneOnGreen: AdvantageBlockProperties = {
        header: 'Играй',
        description: 'Увлекательная игра',
        textColor: '#000000',
        backgroundColor: '#CBEA5E',
        image: <StaticImage src="../../../assets/images/iPhone 14.png" alt="advantage" />,
    };

    const notebookOnBlue: AdvantageBlockProperties = {
        header: 'Везде',
        description: 'На всех платформах',
        textColor: '#FFFFFF',
        backgroundColor: '#0066FF',
        image: <StaticImage src="../../../assets/images/MacBook Pro 16.png" alt="advantage" />,
    };

    const terminalOnWhite: AdvantageBlockProperties = {
        header: 'Оглянись',
        description: 'Терминалы везде',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        image: TerminalImage(),
    };

    const giftRight: NewBlockProperties = {
        color: '#000000',
        backgroundColor: '#FFFFFF',
    }

    return (
      <section className='advantages-container'>
          <AdvantageFullBlock props={phoneOnGreen} />
          <AdvantageGiftBlock props={giftRight} />
          <AdvantageFullBlock props={notebookOnBlue} />
          <AdvantageFullBlock props={terminalOnWhite} />
          <AdvantageLocationBlock />
          <AdvantageMapBlock />
      </section>
    );
}

function AdvantageFullBlock({props}: {props: AdvantageBlockProperties}) {
    const textBlockCSS = {
        backgroundColor: props.backgroundColor,
        color: props.textColor,
    };

    return(
        <div className='advantage-block advantage-block-radius' style={textBlockCSS}>
            <div className='advantage-half-block'>
                {props.image}
            </div>
            <div className='advantage-half-block'>
                <div className='advantage-text advantage-half-block-text'>
                    <p className='advantage-text-header'>{props.header}.</p>
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    );
}

function AdvantageGiftBlock({props}: {props: NewBlockProperties}) {
    const textBlockCSS = {
        color: props.color,
        backgroundColor: props.backgroundColor,
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
                <StaticImage src="../../../assets/images/Gift.png" alt="advantage" />
            </div>
        </div>
    );
}

function AdvantageLocationBlock() {
    const textBlockCSS = {
        color: '#000000',
        backgroundColor: '#FFFFFF',
    };

    return(
        <div className='advantage-block'>
            <div className='advantage-half-block'>
                <StaticImage src="../../../assets/images/Location.png" alt="advantage" />
            </div>
            <div className='advantage-half-block advantage-block-radius' style={textBlockCSS}>
                <div className='advantage-text advantage-half-block-text'>
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
            <StaticImage src="../../../assets/images/Terminal.png" alt="advantage" />
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
                <StaticImage src="../../../assets/images/ShadowMapLeft.png" alt="advantage" />
                <StaticImage src="../../../assets/images/ShadowMapRight.png" alt="advantage" />
            </div>
        </div>
    )
}
