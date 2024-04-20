import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useEffect, useRef } from 'react';
import phoneCut from '../../../assets/images/Phone_Cut.png';
import './ProductDescription.scss';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';

export function useFirstRender() {
    const firstRender = useRef(true);

    useEffect(() => {
        firstRender.current = false;
    }, []);

    return firstRender.current;
}

export function ProductDescription() {
    const { t } = useI18next();

    const mapAppState = useMapAppState();
    const showProductDescription = mapAppState.usageStep === MapAppUsageStep.HOME_SCREEN;
    const animationClass = showProductDescription
        ? 'product-description-window-appears'
        : 'product-description-window-disappears';

    return (
        <div className={`product-description-window ${animationClass}`}>
            <div className="product-description-shadow" />
            <div className="product-description-content-container">
                <div className="product-description-text">
                    <h1>{`${t('brand')} ${t('map')}`}</h1>
                    <p>{t('loginCallToAction')}</p>
                </div>
                <img src={phoneCut} alt="product-description-phone-image" />
            </div>
        </div>
    );
}
