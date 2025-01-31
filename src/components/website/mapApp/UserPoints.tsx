import React from 'react';
import Points from '/src/assets/images/Points.svg';
import { useMapAppState } from './redux/MapAppState';
import { UserPointsLoader } from './UserPointsLoader';

export function UserPoints(props: { className: string }) {
    const { currentUserPoints } = useMapAppState();

    return (
        <div className={`${props.className} user-points-header-block`}>
            <img src={Points} alt="user-points-image" />
            {currentUserPoints === null ? (
                <UserPointsLoader />
            ) : (
                <span className="user-points">{currentUserPoints}</span>
            )}
        </div>
    );
}
