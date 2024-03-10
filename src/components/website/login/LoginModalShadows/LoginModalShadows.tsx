import React from 'react';
import './LoginModalShadows.scss';

export function LoginModalShadows() {
    return (
        <div className="login-modal-shadows-container">
            <div className="login-modal-shadows-left-container">
                <div className="login-modal-shadow login-modal-shadow-green"></div>
            </div>
            <div className="login-modal-shadows-right-container">
                <div className="login-modal-shadow login-modal-shadow-blue"></div>
            </div>
        </div>
    );
}
