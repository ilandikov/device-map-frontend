/* External dependencies */
import React, { ReactElement } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './advantages.css';

type AdvantageBlockProperties = {
    header: string,
    description: string,
    textColor: string,
    backgroundColor: string,
    image: ReactElement,
};

type AdvantageFullBlockProperties = AdvantageBlockProperties & { imageContainerStyle: string };
type AdvantageSplitBlockProperties = AdvantageBlockProperties & { imageFirst: boolean }

export default function Advantages() {
    const phoneOnGreen: AdvantageFullBlockProperties = {
        header: 'Играй',
        description: 'Увлекательная игра',
        textColor: '#000000',
        backgroundColor: '#CBEA5E',
        image: <StaticImage src="../../../assets/images/iPhone 14.png" alt="advantage" />,
        imageContainerStyle: '',
    };

    const giftRight: AdvantageSplitBlockProperties = {
        header: 'Обменивай',
        description: 'Получай подарки',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        image: <StaticImage src="../../../assets/images/Gift.png" alt="advantage" />,
        imageFirst: false,
    }

    const notebookOnBlue: AdvantageFullBlockProperties = {
        header: 'Везде',
        description: 'На всех платформах',
        textColor: '#FFFFFF',
        backgroundColor: '#0066FF',
        image: <StaticImage src="../../../assets/images/MacBook Pro 16.png" alt="advantage" />,
        imageContainerStyle: '',
    };

    const terminalOnWhite: AdvantageFullBlockProperties = {
        header: 'Оглянись',
        description: 'Терминалы везде',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        image: <StaticImage src="../../../assets/images/Terminal.png" alt="advantage" />,
        imageContainerStyle: 'advantage-block-terminal-image-container',
    };

    const locationLeft: AdvantageSplitBlockProperties = {
        header: 'Отмечай',
        description: 'Мы поставим терминал',
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        image: <StaticImage src="../../../assets/images/Location.png" alt="advantage" />,
        imageFirst: true,
    }

    return (
      <section className='advantages-container'>
          <AdvantageFullBlock props={phoneOnGreen} />
          <AdvantageSplitBlock props={giftRight} />
          <AdvantageFullBlock props={notebookOnBlue} />
          <AdvantageFullBlock props={terminalOnWhite} />
          <AdvantageSplitBlock props={locationLeft} />
          <div className="advantage-block advantages-block-map">
              <div className="advantage-block-text">
                  <p>Изучай.</p>
                  <p>Уникальная карта</p>
              </div>
              <div className="advantage-block-map-shadows">
                  <StaticImage src="../../../assets/images/ShadowMapLeft.png" alt="advantage" />
                  <StaticImage src="../../../assets/images/ShadowMapRight.png" alt="advantage" />
              </div>
          </div>
      </section>
    );
}

function AdvantageFullBlock({ props }: { props: AdvantageFullBlockProperties }) {
    const fullBlockColors = {
        backgroundColor: props.backgroundColor,
        color: props.textColor,
    };

    return (
      <div className="advantage-block advantage-block-radius" style={fullBlockColors}>
          <div className="advantage-block-half">
              <div className={props.imageContainerStyle}>
                  {props.image}
              </div>
            </div>
            <div className='advantage-block-half'>
                <div className='advantage-block-text advantage-block-half-text-container'>
                    <p>{props.header}.</p>
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    );
}

function AdvantageSplitBlock({props}: {props: AdvantageSplitBlockProperties}) {
    const halfBlockColors = {
        color: props.textColor,
        backgroundColor: props.backgroundColor,
    };

    const advantageBlocks = [
        <div className="advantage-block-half advantage-block-radius" style={halfBlockColors}>
            <div className="advantage-block-text advantage-block-half-text-container">
                <p>{props.header}.</p>
                <p>{props.description}</p>
            </div>
        </div>,
        <div className="advantage-block-half">
            {props.image}
        </div>,
    ];

    if (props.imageFirst) {
        advantageBlocks.reverse();
    }

    return(
        <div className='advantage-block'>
            {advantageBlocks}
        </div>
    );
}
