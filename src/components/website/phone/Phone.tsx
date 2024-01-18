/* External dependencies */
import React, { CSSProperties } from 'react';
import './phone.css';

export default function Phone() {
    const headers: string[] = [
        "Исследуйте",
        "Отмечайте",
        "Зарабатывай баллы",
    ];

    return (
        <section className="phone-background phone-text-blocks">
            <TextBlocks headers={headers} />
        </section>
    );
}

function TextBlocks({ headers }:{ headers:string[] }) {
    return headers.map((header) => {
        return <TextBlock header={ header }/>;
    });
}

function TextBlock({ header }:{ header:string }) {
    return (
        <div className="phone-header-and-description">
            <p className='header'>{header}</p>
            <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
        </div>
    );
}
