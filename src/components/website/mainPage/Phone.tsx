/* External dependencies */
import React from 'react';
import './Phone.scss';

export default function Phone() {
    const headers = ['Исследуйте', 'Отмечайте', 'Зарабатывай баллы'];
    return (
        <section className="phone-text-blocks">
            {headers.map((header) => {
                return (
                    <div className="phone-text-block" key={header}>
                        <p>{header}</p>
                        <span>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</span>
                    </div>
                );
            })}
        </section>
    );
}
