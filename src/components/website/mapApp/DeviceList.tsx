import React from 'react';
import { useI18next } from 'gatsby-plugin-react-i18next';
import home from '../../../assets/images/Home.png';

export function DeviceList() {
    const { t } = useI18next();
    return (
        <div className="devices-list-window">
            <div className="devices-list-address-container">
                <img src={home} alt="devices-list-address-image" />
                <div className="devices-address">
                    <h2>Address1</h2>
                    <span>Address2</span>
                </div>
            </div>
            <div className="devices-list-container">
                <div className="devices-list-item">
                    <p>Terminal name</p>
                    <button>{t('deviceReportBroken')}</button>
                </div>
            </div>
        </div>
    );
}
