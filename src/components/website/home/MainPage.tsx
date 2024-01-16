/* External dependencies */
import React, { CSSProperties } from 'react';
import Header from '../../header/header';

/* Local dependencies */

export default function MainPage() {
  const siteContainer: CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
  }
  return (
    <div style={siteContainer}>
      <Header />
    </div>
  );
}
