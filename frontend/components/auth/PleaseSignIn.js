import React from 'react'
import User from './User'
import Signon from './Signon'
import { Spinner } from 'reactstrap'
import Router from 'next/router'

const Redirect = () => {
  Router.push('/signon')
}

const PleaseSignIn = props => {
  return (
    <User>
      {({ data, loading }) => {
        if (loading) <Spinner color='info' />
        if (!data.me) {
          return <Signon />
        }
        return props.children
      }}
    </User>
  )
}

export default PleaseSignIn
