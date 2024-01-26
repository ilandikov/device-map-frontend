/* External dependencies */
import React, { CSSProperties } from 'react';
import Header from '../../header/header';

/* Local dependencies */
import Map from '../map/Map';
import Phone from '../phone/Phone';
import Advantages from '../advantages/advantages';
import Footer from '../footer/Footer';
import './MainPage.css';

export default function MainPage() {
  return (
    <div className='main-page-container'>
      <Header />
      <Map />
      <Phone />
      <Advantages />
      <Footer />
    </div>
  );
}
