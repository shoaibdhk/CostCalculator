import React, { Component } from 'react'
import styled from 'styled-components'
import Head from 'next/head'
import PleaseSignIn from '../components/auth/PleaseSignIn'
import Router from 'next/router'
import redirect from '../lib/redirect'
import { CURRENT_USER_QUERY } from '../components/auth/User'
import Dashboard from '../components/layout/Dashboard'
const Header = styled.h1`
  color: red;
`
// class Home extends Component {
//     static async getInitialProps({ res, apolloClient }) {
//       const { data } = await apolloClient.query({ query: CURRENT_USER_QUERY })

//       console.log(res)
//       if (data.me === null) {
//         if (res !== undefined) {
//           res.redirect('/signon')
//         } else {
//           Router.push('/signon')
//         }
//       }

//       return {}
//     }
//   render() {
//     return (

//     )
//   }
// }

const Home = props => (
  <PleaseSignIn>
    <Dashboard />
  </PleaseSignIn>
)

export default Home
