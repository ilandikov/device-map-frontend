/* External dependencies */
import React from "react";

/* Local dependencies */
import './login.css';
import { StaticImage } from "gatsby-plugin-image";

export default function Login() {
    return (
        <div className='login-container'>
          <div className='login-background'>
            <div className='login-window'>
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
            </div>
          </div>
        </div>
      );
}
