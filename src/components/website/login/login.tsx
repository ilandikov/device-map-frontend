/* External dependencies */
import React, { CSSProperties } from "react";

/* Local dependencies */
import './login.css';
import { StaticImage } from "gatsby-plugin-image";

export default function Login() {
  return (
      <>
        <div className='login-container login-background'>
          <div className='login-container login-header'>
            <div className='login-header-block'>
                <StaticImage className='login-header-brand-logo' src='../../../assets/images/LogoGreen.svg' alt='logo' />
                <p className='login-header-brand-text'>Карта</p>
            </div>
            <div className='login-header-block'>
              <div className='login-header-inner-block'>
                <StaticImage className='login-header-account-image' src="../../../assets/images/Account.svg" alt="login-header-account" />
                <p className='login-header-account-text'>Войти</p>
              </div>
              <div className='login-header-inner-block'>
                <StaticImage className='login-header-apps-google-play' src="../../../assets/images/GooglePlay.svg" alt="login-header-apps-google-play" />
                <StaticImage className='login-header-apps-app-store'src="../../../assets/images/AppStore.svg" alt="login-header-apps-app-store" />
              </div>
            </div>
          </div>
          <div className='login-window-container'>
            <div className='login-window'>
              <Ellipses />
              <div className='login-window-content-container'>
                <LoginWelcome />  
              </div>
            </div>
          </div>
        </div>
      </>
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
  return(
    <>
      <div className='login-window-top-container'>
        <StaticImage className='login-window-logo' src='../../../assets/images/LogoGreen.svg' alt='logo' />
        <p className='login-window-brand'>Финик Карта</p>
        <p className='login-window-description'>Отмечай места на карте где нет нашего терминала, мы поставим его, а тебе пришлем бонусы которые ты сможешь обменять на реальные призы</p>
      </div>
      <div className='login-window-bottom-container'>
        <div className='login-window-button login-window-button-signin'>
          <p>Войти в аккаунт</p>
        </div>
        <div className='login-window-button login-window-button-register'>
          <p>Регистрация</p>
        </div>
      </div>
    </>
  );
}
