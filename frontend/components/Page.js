import React, { Component } from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import Navbar from './layout/Navbar'

const theme = {
  red: '#e74c3c',
  cardColor: '#17141d',
  brown: '#3e2723',
  white: '#95a5a6',
  maxWidth: '1200px',
  boxShadow: '-1rem 0 3rem #000',
  yellow: 'rgba(241, 196, 15, 1)'
}
const progressColor = '#e74c3c'
const GlobalStyle = createGlobalStyle`
#nprogress{pointer-events:none}#nprogress
      .bar{
        background:${progressColor};
        position:fixed;z-index:1031;top:0;left:0;width:100%;height:5px
      }
      #nprogress .peg{
        display:block;position:absolute;right:0;width:100px;height:100%;box-shadow:0 0 10px ${progressColor},0 0 5px ${progressColor};opacity:1;-webkit-transform:rotate(3deg) translate(0,-4px);-ms-transform:rotate(3deg) translate(0,-4px);transform:rotate(3deg) translate(0,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:solid 2px transparent;border-top-color:${progressColor};border-left-color:${progressColor};border-radius:50%;-webkit-animation:nprogress-spinner .4s linear infinite;animation:nprogress-spinner .4s linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}

  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: Rubik, Lato, "Lucida Grande","Lucida Sans Unicode",Tahoma, Sans-Serif;
    background: #222831;
    color: ${props => props.theme.white}
  }
  a {
    text-decoration: none;
    color: ${theme.primary};
    &:hover{
      text-decoration: underline;
    }
  }
`

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 20px auto 85px auto;
  padding: 2rem;
`

class Page extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <Navbar />
          <Inner>
            {this.props.children}
            <GlobalStyle />
          </Inner>
        </div>
      </ThemeProvider>
    )
  }
}

export default Page
