/* External dependencies */
import React, { CSSProperties } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import './phone.css';

export default function Phone() {
    return (
        <div className="phone-background phone-text-blocks">
            <div className="phone-header-and-description">
                <p className='header'>Исслейдуте</p>
                <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
            </div>
            <div className="phone-header-and-description">
                <p className='header'>Отмечайте</p>
                <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
            </div>
            <div className="phone-header-and-description">
                <p className='header'>Зарабатывай баллы</p>
                <p className='description'>Карта терминалов от Finik, исследуйте, отмечайте и зарабатывайте баллы</p>
            </div>
        </div>
    );
}
