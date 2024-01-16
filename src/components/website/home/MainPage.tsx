/* External dependencies */
import React, { CSSProperties } from 'react';
import Header from '../../header/header';

/* Local dependencies */
import Map from '../map/Map';
import Logo from '../logo/Logo';
import Phone from '../phone/Phone';

export default function MainPage() {
  const siteContainer: CSSProperties = {
    maxWidth: '1440px',
    margin: '0 auto',
  }
  return (
    <div style={siteContainer}>
      <Header />
      <Logo />
      <Map />
      <Phone />
    </div>
  );
}
