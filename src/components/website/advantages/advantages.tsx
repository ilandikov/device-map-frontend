/* External dependencies */
import React, { CSSProperties, ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';
import { prop } from 'cheerio/lib/api/attributes';

type AdvantageBlockProperties = {
    header: string,
    description: string,
    textColor: string,
    backgroundColor: string,
    image: any,
};

type AdvantageFullBlockProperties = AdvantageBlockProperties & { imageContainerStyle?: string };
type AdvantageSplitBlockProperties = AdvantageBlockProperties & { imageFirst: boolean }

export default function Advantages() {
    const phoneOnGreen: AdvantageFullBlockProperties = {
        header: 'Играй',
        description: 'Увлекательная игра',
        textColor: '#000000',
        backgroundColor: '#CBEA5E',
        image: <StaticImage src="../../../assets/images/iPhone 14.png" alt="advantage" />,
    };

    const notebookOnBlue: AdvantageFullBlockProperties = {
        header: 'Везде',
        description: 'На всех платформах',
        textColor: '#FFFFFF',
        backgroundColor: '#0066FF',
        image: <StaticImage src="../../../assets/images/MacBook Pro 16.png" alt="advantage" />,
    };

    const terminalOnWhite: AdvantageFullBlockProperties = {
        header: 'Оглянись',
        description: 'Терминалы везде',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        image: <StaticImage src="../../../assets/images/Terminal.png" alt="advantage" />,
        imageContainerStyle: 'advantage-block-terminal-image-container',
    };

    const giftRight: AdvantageSplitBlockProperties = {
        header: 'Обменивай',
        description: 'Получай подарки',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        image: <StaticImage src="../../../assets/images/Gift.png" alt="advantage" />,
        imageFirst: false,
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

function AdvantageFullBlock({props}: {props: AdvantageFullBlockProperties}) {
    const textBlockCSS = {
        backgroundColor: props.backgroundColor,
        color: props.textColor,
    };

    return(
        <div className='advantage-block advantage-block-radius' style={textBlockCSS}>
            <div className='advantage-half-block'>
                <div className={props.imageContainerStyle}>
                    {props.image}
                </div>
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

function AdvantageGiftBlock({props}: {props: AdvantageSplitBlockProperties}) {
    const textBlockCSS = {
        color: props.textColor,
        backgroundColor: props.backgroundColor,
    };

    return(
        <div className='advantage-block'>
            <div className='advantage-half-block advantage-block-radius' style={textBlockCSS}>
                <div className='advantage-text advantage-half-block-text'>
                    <p className='advantage-text-header'>{props.header}.</p>
                    <p>{props.description}</p>
                </div>
            </div>
            <div className='advantage-half-block'>
                {props.image}
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
