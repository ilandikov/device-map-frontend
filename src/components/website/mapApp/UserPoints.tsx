import React from 'react';
import Points from '/src/assets/images/Points.svg';
import { FinikLoader } from '../common/FinikLoader';
import { useMapAppState } from './redux/MapAppState';

export function UserPoints(props: { className: string }) {
    const { currentUserPoints } = useMapAppState();

    return (
        <div className={`${props.className} user-points-header-block`}>
            <img src={Points} alt="user-points-image" />
            {currentUserPoints !== null ? (
                <span className="user-points">{currentUserPoints}</span>
            ) : (
                <div className="user-points-loader-container">
                    <FinikLoader />
                </div>
            )}
        </div>
    );
}
