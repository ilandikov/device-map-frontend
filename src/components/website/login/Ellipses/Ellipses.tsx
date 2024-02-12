import React from 'react';
import './Ellipses.scss';

export function Ellipses() {
    return (
        <div className="login-ellipses-container" data-testid="ellipses">
            <div className="login-ellipse-left-container">
                <div className="login-ellipse login-ellipse-green"></div>
            </div>
            <div className="login-ellipse-right-container">
                <div className="login-ellipse login-ellipse-blue"></div>
            </div>
        </div>
    );
}
