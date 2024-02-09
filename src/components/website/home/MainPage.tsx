/* External dependencies */
import React from 'react';
import Header from '../../header/Header';

/* Local dependencies */
import Map from '../map/Map';
import Phone from '../phone/Phone';
import Advantages from '../advantages/Advantages';
import Footer from '../footer/Footer';
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
