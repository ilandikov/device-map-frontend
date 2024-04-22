import React from 'react';
import { AdvantageBlockProperties } from './Advantages';

export type AdvantageSplitBlockProperties = AdvantageBlockProperties & { imageFirst: boolean };

export function AdvantageSplitBlock({ props }: { props: AdvantageSplitBlockProperties }) {
    const halfBlockColors = {
        color: props.textColor,
        backgroundColor: props.backgroundColor,
    };

    const advantageBlocks = [
        <div
            className="advantage-block-half advantage-block-radius"
            style={halfBlockColors}
            key="advantageSplitBlock_Text"
        >
            <div className="advantage-block-text advantage-block-half-text-container">
                <p>{props.header}.</p>
                <p>{props.description}</p>
            </div>
        </div>,
        <div className="advantage-block-half" key="advantageSplitBlock_Image">
            {props.image}
        </div>,
    ];

    if (props.imageFirst) {
        advantageBlocks.reverse();
    }

    return <div className="advantage-block">{advantageBlocks}</div>;
}
