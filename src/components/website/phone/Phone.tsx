/* External dependencies */
import React from 'react';
import './phone.css';

export default function Phone() {
    return (
        <section className="phone-background phone-text-blocks">
            <TextBlocks headers={[
                'Исследуйте', 'Отмечайте', 'Зарабатывай баллы',
            ]} />
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
