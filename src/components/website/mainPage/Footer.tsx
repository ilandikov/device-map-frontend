/* External dependencies */
import React from 'react';

/* Local dependencies */
import './Footer.scss';
import Logo from '/src/assets/images/Logo.svg';
import SocialFacebook from '/src/assets/images/SocialFacebook.svg';
import SocialTwitter from '/src/assets/images/SocialTwitter.svg';
import SocialInstagram from '/src/assets/images/SocialInstagram.svg';
import SocialLinkedIn from '/src/assets/images/SocialLinkedIn.svg';
import SocialYouTube from '/src/assets/images/SocialYouTube.svg';
import SocialTelegram from '/src/assets/images/SocialTelegram.svg';

export default function Footer() {
    return (
        <footer className="footer-outer-container">
            <div className="footer-inner-container">
                <div className="footer-brand">
                    <div className="footer-brand-logo">
                        <img src={Logo} alt="logo" />
                        <p>Finik</p>
                    </div>
                    <div className="footer-brand-description">
                        <p>Удобное и надежное отечественное приложение для оплаты в Кыргызстане</p>
                        <p>©2022 Averspay</p>
                        <p>Лицензия НБКР № 3006010615, № 2006010615 от 06.02.2015</p>
                    </div>
                </div>
                <ul className="footer-links">
                    <li>Продукты</li>
                    <li>Кошелек</li>
                    <li>Терминалы</li>
                    <li>Эквайринг</li>
                </ul>
                <ul className="footer-links">
                    <li>О нас</li>
                    <li>Компания</li>
                    <li>Документы</li>
                </ul>
                <div className="footer-contacts">
                    <img src={SocialFacebook} alt="social-facebook" />
                    <img src={SocialTwitter} alt="social-twitter" />
                    <img src={SocialInstagram} alt="social-instagram" />
                    <img src={SocialLinkedIn} alt="social-linkedin" />
                    <img src={SocialYouTube} alt="social-youtube" />
                    <img src={SocialTelegram} alt="social-telegram" />
                </div>
            </div>
        </footer>
    );
}
