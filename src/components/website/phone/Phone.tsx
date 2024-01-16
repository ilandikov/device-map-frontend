/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './phone.css';

function textBlock(header: string) {
    return (
        <div className="phone-header-and-description">
            <p className='header'>{header}</p>
            <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
        </div>
    );
}
export default function Phone() {
    return (
        <div className="phone-background phone-text-blocks">
            {textBlock("Исследуйте")}
            {textBlock("Отмечайте")}
            {textBlock("Зарабатывай баллы")}
        </div>
    );
}
