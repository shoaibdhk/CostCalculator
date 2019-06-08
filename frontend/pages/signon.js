import Signon from '../components/auth/Signon'
import Link from 'next/link'
import User, { CURRENT_USER_QUERY } from '../components/auth/User'
import Router from 'next/router'
import { removeArgumentsFromDocument } from 'apollo-utilities'

class SignonPage extends React.Component {
  static async getInitialProps({ res, apolloClient }) {
    const { data } = await apolloClient.query({ query: CURRENT_USER_QUERY })

    if (data.me !== null) {
      if (res) {
        res.redirect('/')
      } else {
        Router.push('/')
      }
    }

    return {}
  }
  render() {
    return <Signon />
  }
}

export default SignonPage
