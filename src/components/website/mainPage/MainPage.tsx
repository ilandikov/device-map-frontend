/* External dependencies */
import React from 'react';
import Header from './Header';

/* Local dependencies */
import Hero from './Hero';
import Phone from './Phone';
import Advantages from './Advantages';
import Footer from './Footer';
import './MainPage.scss';

export default function MainPage() {
    return (
        <div className="main-page-container">
            <Header />
            <Hero />
            <Phone />
            <Advantages />
            <Footer />
        </div>
    );
}
