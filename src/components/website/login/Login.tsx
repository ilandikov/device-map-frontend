/* External dependencies */
import React from 'react';

/* Local dependencies */
import './Login.scss';
import { LoginHeader } from './LoginHeader';
import { LoginModal } from './LoginModal';

export default function Login() {
    return (
        <div className="login-container login-background">
            <LoginHeader />
            <div className="login-modal-container">
                <div className="login-modal">
                    <div className="login-modal-content-container">
                        <LoginModal />
                    </div>
                </div>
            </div>
        </div>
    );
}
