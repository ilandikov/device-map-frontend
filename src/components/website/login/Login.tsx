/* External dependencies */
import React from 'react';

/* Local dependencies */
import './Login.scss';
import { LoginHeader } from './LoginHeader';
import { LoginModal } from './LoginModal';

export default function Login() {
    return (
        <div className="login-container">
            <LoginHeader />
            <div className="login-window">
                <div className="login-window-content-container">
                    <LoginModal />
                </div>
            </div>
        </div>
    );
}
