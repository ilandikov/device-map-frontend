import React from 'react'
import './header.scss'
import { StaticImage } from 'gatsby-plugin-image';

export default function Header() {
  return (
    <header>
      <div className='header-logo-container'>
        <StaticImage className='header-logo' src="../../assets/images/Logo.svg" alt="logo" />
      </div>
    </header>
  )
}
