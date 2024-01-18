/* External dependencies */
import React, { CSSProperties } from 'react';
import Header from '../../header/header';

/* Local dependencies */
import Map from '../map/Map';
import Phone from '../phone/Phone';
import Advantages from '../advantages/advantages';
import Footer from '../footer/Footer';

export default function MainPage() {
  const siteContainer: CSSProperties = {
    width: '1440px',
    margin: '0 auto',
    overflow: 'scroll'
  }
  return (
    <div style={siteContainer}>
      <Header />
      <Map />
      <Phone />
      <Advantages />
      <Footer />
    </div>
  );
}
