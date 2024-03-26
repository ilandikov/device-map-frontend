import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Points from '/src/assets/images/Points.svg';

export function UserPoints() {
    const { t } = useI18next();
    const userPoints = 320;

    return (
        <div className="map-app-header-block user-points-header-block">
            <img src={Points} alt="user-points-image" />
            <span className="user-points">{userPoints}</span>
            <span className="user-points">{userPoints > 1 ? t('points') : t('point')}</span>
        </div>
    );
}
