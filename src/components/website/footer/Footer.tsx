/* External dependencies */
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

/* Local dependencies */
import './footer.css';

export default function Footer() {
    const LogoWithBrandCSS = {
      maxWidth: '105px',
    }
    
    return (
        <div className='footer-outer-container'>
          <div className='footer-inner-container'>
            <div className='footer-brand'>
              <StaticImage src="./LogoWithBrand.png" alt="logo" style={LogoWithBrandCSS} />
              <p className='footer-brand-bigger-text'>Удобное и надежное отечественное приложение для оплаты в Кыргызстане</p>
              <p className='footer-brand-smaller-text'>©2022 Averspay Лицензия НБКР № 3006010615, № 2006010615 от 06.02.2015</p>
            </div>
            <div className='footer-links'>
              <p className='footer-first-link'>Продукты</p>
              <p>Кошелек</p>
              <p>Терминалы</p>
              <p>Эквайринг</p>
            </div>
            <div className='footer-links'>
              <p className='footer-first-link'>О нас</p>
              <p>Компания</p>
              <p>Документы</p>
            </div>
            <div className='footer-contacts'>
              <StaticImage src="./SocialFacebook.png" alt="logo" />
              <StaticImage src="./SocialTwitter.png" alt="logo" />
              <StaticImage src="./SocialInstagram.png" alt="logo" />
              <StaticImage src="./SocialLinkedIn.png" alt="logo" />
              <StaticImage src="./SocialYouTube.png" alt="logo" />
              <StaticImage src="./SocialTelegram.png" alt="logo" />
            </div>
          </div>
        </div>
      );
}
