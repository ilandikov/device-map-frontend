import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Points from '/src/assets/images/Points.svg';
import { FinikLoader } from '../common/FinikLoader';

export function UserPoints(props: { className: string }) {
    const { t } = useI18next();
    const userPoints: number | null = 320;

    return (
        <div className={`${props.className} user-points-header-block`}>
            <img src={Points} alt="user-points-image" />
            {userPoints !== null ? (
                <>
                    <span className="user-points">{userPoints}</span>
                    <span className="user-points">{userPoints > 1 ? t('points') : t('point')}</span>
                </>
            ) : (
                <div className="user-points-loader-container">
                    <FinikLoader />
                </div>
            )}
        </div>
    );
}
