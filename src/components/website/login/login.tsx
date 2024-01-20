/* External dependencies */
import React, { CSSProperties } from "react";

/* Local dependencies */
import './login.css';
import { StaticImage } from "gatsby-plugin-image";

export default function Login() {
  return (
      <div className='login-container'>
        <Pins />
        <div className='login-header'>
          <div className='login-header-block'>
              <StaticImage className='login-header-brand-logo' src='../../../assets/images/LogoGreen.svg' alt='logo' />
              <p className='login-header-brand-text'>Карта</p>
          </div>
        </div>
        <div className='login-window'>
            <Ellipses />
            <div className='login-window-content-container'>
              <LoginWelcome />
            </div>
          </div>
      </div>
    );
}

function Pins() {
  const pinPositions: CSSProperties[] = [
    {
      top: '230px',
      left: '649px',
    },
    {
      top: '188px',
      left: '751px',
    },
    {
      top: '481px',
      left: '1089px',
    },
    {
      top: '564px',
      left: '1172px',
    },
    {
      top: '769px',
      left: '1014px',
    },
    {
      top: '774px',
      left: '1069px',
    },
    {
      top: '781px',
      left: '1180px',
    },
    {
      top: '857px',
      left: '1115px',
    },
    {
      top: '881px',
      left: '1022px',
    },
  ];

  const pins = pinPositions.map((pinPosition) => {
    const pinCSS: CSSProperties = { ...{ position: 'absolute' }, ...pinPosition };
    return <StaticImage style={pinCSS} src='../../../assets/images/BlackPin.svg' alt='location-pin' />
  });

  return (
    <div className= 'login-pin-container'>
        {pins}
    </div>
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
