/* External dependencies */
import React from "react";

/* Local dependencies */
import './login.css';

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
            </div>
          </div>
        </div>
      );
}
