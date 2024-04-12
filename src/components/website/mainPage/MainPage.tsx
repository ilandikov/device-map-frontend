/* External dependencies */
import React from 'react';
import Header from './Header';

/* Local dependencies */
import Map from './Map';
import Phone from './Phone';
import Advantages from './Advantages';
import Footer from './Footer';
import './MainPage.scss';

export default function MainPage() {
    return (
        <div className="main-page-container">
            <Header />
            <Map />
            <Phone />
            <Advantages />
            <Footer />
        </div>
    );
}
