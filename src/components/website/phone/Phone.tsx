/* External dependencies */
import React from 'react';
import './Phone.scss';

export default function Phone() {
    const headers = ['Исследуйте', 'Отмечайте', 'Зарабатывай баллы'];
    return (
        <section className="phone-background phone-text-blocks">
            {headers.map((header) => {
                return (
                    <div className="phone-header-and-description">
                        <p className="header">{header}</p>
                        <p className="description">
                            Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы
                        </p>
                    </div>
                );
            })}
        </section>
    );
}
