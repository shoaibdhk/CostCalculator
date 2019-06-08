import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import Router from 'next/router'
import Container from '../styled/SignonContainer'
import Errors from './Error'
import catchErrors from '../../lib/catchError'
import { CURRENT_USER_QUERY } from './User'
import { Spinner } from 'reactstrap'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
    }
  }
`
const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
    }
  }
`

class Signon extends Component {
  state = {
    container: 'container',
    name: '',
    email: '',
    password: ''
  }
  onChangeValue = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    return (
      <Container>
        <div className={`${this.state.container}`} id='container'>
          <div className='form-container sign-up-container'>
            <Mutation
              mutation={SIGNUP_MUTATION}
              variables={this.state}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {(singup, { data, loading, error }) => {
                const errorMessage = catchErrors(error)

                if (loading) <p>Loading...</p>

                return (
                  <form
                    onSubmit={async e => {
                      e.preventDefault()
                      const signedUp = await singup()
                      if (signedUp) {
                        Router.push('/')
                      }
                    }}
                    method='post'
                  >
                    <h1>Create Account</h1>
                    <div className='social-container'>
                      <a href='#' className='social'>
                        <i className='fab fa-facebook-f' />
                      </a>
                      <a href='#' className='social'>
                        <i className='fab fa-google-plus-g' />
                      </a>
                      <a href='#' className='social'>
                        <i className='fab fa-linkedin-in' />
                      </a>
                    </div>
                    <span>or use your email for registration</span>
                    {Object.keys(this.state).map(key => {
                      if (key !== 'container') {
                        return (
                          <>
                            <input
                              type={key}
                              placeholder={key}
                              name={key}
                              value={this.state.key}
                              onChange={this.onChangeValue}
                              className={errorMessage && errorMessage[key] ? 'is-invalid' : ''}
                            />
                            {errorMessage && errorMessage[key] && (
                              <div className='invalid-feedback'>{errorMessage[key]}</div>
                            )}
                          </>
                        )
                      }
                    })}
                    <button>{loading ? <Spinner color='info' /> : `Sign Up`}</button>
                  </form>
                )
              }}
            </Mutation>
          </div>
          <div className='form-container sign-in-container'>
            <Mutation
              mutation={SIGNIN_MUTATION}
              variables={this.state}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {(signin, { data, loading, error }) => {
                if (loading) <p>Loading...</p>
                const errorMessage = catchErrors(error)
                return (
                  <form
                    method='post'
                    onSubmit={async e => {
                      e.preventDefault()
                      const signedIn = await signin()
                      if (signedIn) {
                        Router.push('/')
                      }
                    }}
                  >
                    <h1>Sign in</h1>
                    <div className='social-container'>
                      <a href='#' className='social'>
                        <i className='fab fa-facebook-f' />
                      </a>
                      <a href='#' className='social'>
                        <i className='fab fa-google-plus-g' />
                      </a>
                      <a href='#' className='social'>
                        <i className='fab fa-linkedin-in' />
                      </a>
                    </div>
                    <span>or use your account</span>
                    {Object.keys(this.state).map(key => {
                      if (key !== 'container' && key !== 'name') {
                        return (
                          <>
                            <input
                              type={key}
                              placeholder={key}
                              name={key}
                              value={this.state.key}
                              onChange={this.onChangeValue}
                              className={errorMessage && errorMessage[key] ? 'is-invalid' : ''}
                            />
                            {errorMessage && errorMessage[key] && (
                              <div className='invalid-feedback'>{errorMessage[key]}</div>
                            )}
                          </>
                        )
                      }
                    })}

                    <a href='#'>Forgot your password?</a>
                    <button>{loading ? <Spinner color='info' /> : `Sign In`}</button>
                  </form>
                )
              }}
            </Mutation>
          </div>
          <div className='overlay-container'>
            <div className='overlay'>
              <div className='overlay-panel overlay-left'>
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <button
                  className='ghost'
                  onClick={() =>
                    this.setState({ container: 'container', name: '', email: '', password: '' })
                  }
                >
                  Sign In
                </button>
              </div>
              <div className='overlay-panel overlay-right'>
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button
                  className='ghost'
                  onClick={() =>
                    this.setState({
                      container: 'container right-panel-active',
                      name: '',
                      email: '',
                      password: ''
                    })
                  }
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default Signon
