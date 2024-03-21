/* External dependencies */
import React from 'react';
import './Phone.scss';

export default function Phone() {
    return (
        <section className="phone-background phone-text-blocks">
            {['Исследуйте', 'Отмечайте', 'Зарабатывай баллы'].map((header) => {
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
