import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import phoneCut from '../../../assets/images/Phone_Cut.png';
import './ProductDescription.scss';

export function ProductDescription() {
    const { t } = useI18next();
    return (
        <div className="product-description-window">
            <div className="product-description-shadow" />
            <div className="product-description-content-container">
                <div className="product-description-text">
                    <h1>{`${t('brand')} ${t('map')}`}</h1>
                    <p>{t('loginCallToAction')}</p>
                </div>
                <img src={phoneCut} alt="map-app-description-image" />
            </div>
        </div>
    );
}
