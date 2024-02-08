import React from 'react';
import './header.scss';
import Logo from '/src/assets/images/Logo.svg';

export default function Header() {
    return (
        <header>
            <div className="header-logo-container">
                <img src={Logo} alt="logo" />
            </div>
        </header>
    );
}
