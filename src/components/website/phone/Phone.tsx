/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './phone.css';
import header from '../../header/header';

function textBlock(header: string) {
    return (
        <div className="phone-header-and-description">
            <p className='header'>{header}</p>
            <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
        </div>
    );
}
export default function Phone() {
    const headers = [
        "Исследуйте",
        "Отмечайте",
        "Зарабатывай баллы",
    ];

    const textBlocks = headers.map((header) => {
        return textBlock(header);
    })

    return (
        <div className="phone-background phone-text-blocks">
            {textBlocks}
        </div>
    );
}
