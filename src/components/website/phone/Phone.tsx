/* External dependencies */
import React, { CSSProperties } from 'react';
import './phone.css';

export default function Phone() {
    const headers = [
        "Исследуйте",
        "Отмечайте",
        "Зарабатывай баллы",
    ];

    const textBlocks = TextBlocks(headers);

    return (
        <section className="phone-background phone-text-blocks">
            {textBlocks}
        </section>
    );
}

function TextBlocks(headers) {
    return headers.map((header) => {
        return textBlock(header);
    });
}

function textBlock(header: string) {
    return (
        <div className="phone-header-and-description">
            <p className='header'>{header}</p>
            <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
        </div>
    );
}
