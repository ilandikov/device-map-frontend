import React from 'react';
import Points from '/src/assets/images/Points.svg';
import { useMapAppState } from './redux/MapAppState';
import { UserPointsLoader } from './UserPointsLoader';

export function UserPoints() {
    const { loggedInUser } = useMapAppState();
    const currentUserPoints = loggedInUser?.points ?? null;

    return (
        <div className="map-app-header-block user-points-header-block">
            <img src={Points} alt="user-points-image" />
            {currentUserPoints === null ? (
                <UserPointsLoader />
            ) : (
                <span className="user-points">{currentUserPoints}</span>
            )}
        </div>
    );
}
