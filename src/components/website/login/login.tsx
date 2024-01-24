/* External dependencies */
import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

/* Local dependencies */
import './login.css';
import { useI18next } from 'gatsby-plugin-react-i18next';

export default function Login() {
  return (
    <div className='login-container login-background'>
      <LoginHeader />
      <div className='login-window-container'>
        <div className='login-window'>
          <Ellipses />
          <div className='login-window-content-container'>
            <LoginWelcome />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginHeader() {
  const { t } = useI18next();
  return (
    <header className="login-container login-header">
      <div className="login-header-block">
        <StaticImage className="login-header-brand-logo" src="../../../assets/images/LogoGreen.svg" alt="logo" />
        <p className="login-header-brand-text">{t('map')}</p>
      </div>
      <div className="login-header-block">
        <div className="login-header-inner-block">
          <StaticImage className="login-header-account-image" src="../../../assets/images/Account.svg"
                       alt="login-header-account" />
          <p className="login-header-account-text">{t('login')}</p>
        </div>
        <div className="login-header-inner-block">
          <StaticImage className="login-header-apps-google-play" src="../../../assets/images/GooglePlay.svg"
                       alt="login-header-apps-google-play" />
          <StaticImage className="login-header-apps-app-store" src="../../../assets/images/AppStore.svg"
                       alt="login-header-apps-app-store" />
        </div>
      </div>
    </header>
  );
}

function Ellipses() {
  return(
    <div className='login-ellipses-container'>
      <div className='login-ellipse-left-container'>
        <div className='login-ellipse login-ellipse-green'>
        </div>
      </div>
      <div className='login-ellipse-right-container'>
        <div className='login-ellipse login-ellipse-blue'>
        </div>
      </div>
    </div>
  );
}

function LoginWelcome() {
  const { t } = useI18next();
  return(
    <>
      <div className='login-window-top-container'>
        <StaticImage className='login-window-logo' src='../../../assets/images/LogoGreen.svg' alt='logo' />
        <p className='login-window-brand'>{ t('brand') } { t('map') }</p>
        <p className='login-window-description'>{ t('loginCallToAction') }</p>
      </div>
      <div className='login-window-bottom-container'>
        <div className='login-window-button login-window-button-signin'>
          <p>{ t('accountLogin') }</p>
        </div>
        <div className='login-window-button login-window-button-register'>
          <p>{ t('accountRegister') }</p>
        </div>
      </div>
    </>
  );
}
