import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import User, { CURRENT_USER_QUERY } from '../auth/User';

const LOGOUT = gql`
  mutation LOGOUT {
    signout
  }
`;
const Navbar = styled.nav`
  margin-top: 20px;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: center;
  li {
    margin: 10px;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none;
    color: #efbb35;
  }
  li:hover {
    color: rgba(231, 76, 60, 1);
  }
`;
const NavBar = () => {
  return (
    <User>
      {({ data, loading }) => {
        if (data.me) {
          return (
            <Navbar>
              <Link href='/'>
                <li>Posts</li>
              </Link>

              <Link href='#'>
                <Mutation mutation={LOGOUT} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
                  {logout => {
                    return (
                      <li
                        onClick={async () => {
                          await logout();
                          Router.push('/signon');
                        }}>
                        Logout
                      </li>
                    );
                  }}
                </Mutation>
              </Link>
            </Navbar>
          );
        } else {
          return null;
        }
      }}
    </User>
  );
};

export default NavBar;
