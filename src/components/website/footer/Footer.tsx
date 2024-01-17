/* External dependencies */
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

/* Local dependencies */
import './footer.css';

export default function Footer() {
    return (
        <div className='footer-container'>
          <div className='footer-brand'>
            <StaticImage src="./LogoWithBrand.png" alt="logo" />
            <p className='footer-brand-bigger-text'>Удобное и надежное отечественное приложение для оплаты в Кыргызстане</p>
            <p className='footer-brand-smaller-text'>©2022 Averspay Лицензия НБКР № 3006010615, № 2006010615 от 06.02.2015</p>
          </div>
          <div className='footer-products'>
          </div>
          <div className='footer-about'>
          </div>
          <div className='footer-contacts'>
          </div>
        </div>
      );
}
