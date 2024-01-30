/* External dependencies */
import React from 'react';

/* Local dependencies */
import './login.css';
import { LoginHeader } from './LoginHeader';
import { LoginModal } from './LoginModal';

export default function Login() {
    return (
        <div className="login-container login-background">
            <LoginHeader />
            <LoginModal />
        </div>
    );
}
