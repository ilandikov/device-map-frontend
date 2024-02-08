/* External dependencies */
import React from 'react';

/* Local dependencies */
import './footer.css';
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
                        <p>
                            ©2022 Averspay
                            <br />
                            Лицензия НБКР № 3006010615, № 2006010615 от 06.02.2015
                        </p>
                    </div>
                </div>
                <div className="footer-links">
                    <p>Продукты</p>
                    <p>Кошелек</p>
                    <p>Терминалы</p>
                    <p>Эквайринг</p>
                </div>
                <div className="footer-links">
                    <p>О нас</p>
                    <p>Компания</p>
                    <p>Документы</p>
                </div>
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
