import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Points from '/src/assets/images/Points.svg';
import { FinikLoader } from '../common/FinikLoader';
import { useMapAppState } from './redux/MapAppState';

export function UserPoints(props: { className: string }) {
    const { t } = useI18next();

    const { currentUserPoints } = useMapAppState();

    return (
        <div className={`${props.className} user-points-header-block`}>
            <img src={Points} alt="user-points-image" />
            {currentUserPoints !== null ? (
                <>
                    <span className="user-points">{currentUserPoints}</span>
                    <span className="user-points">{currentUserPoints > 1 ? t('points') : t('point')}</span>
                </>
            ) : (
                <div className="user-points-loader-container">
                    <FinikLoader />
                </div>
            )}
        </div>
    );
}
