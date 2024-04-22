import React from 'react';
import { AdvantageBlockProperties } from './Advantages';

export type AdvantageFullBlockProperties = AdvantageBlockProperties & { imageContainerStyle: string };

export function AdvantageFullBlock({ props }: { props: AdvantageFullBlockProperties }) {
    const fullBlockColors = {
        backgroundColor: props.backgroundColor,
        color: props.textColor,
    };

    return (
        <div className="advantage-block advantage-block-radius" style={fullBlockColors}>
            <div className="advantage-block-half">
                <div className={props.imageContainerStyle}>{props.image}</div>
            </div>
            <div className="advantage-block-half">
                <div className="advantage-block-text advantage-block-half-text-container">
                    <p>{props.header}.</p>
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    );
}
