import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import Head from 'next/head'
import Button from '../styled/Button'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import formatMoney from '../../lib/formatMoney'
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

export const ALL_POSTS_QUERY = gql`
  query ALL_POSTS_QUERY {
    posts {
      id
      title
      description
      costs {
        id
        title
        price
      }
      createdAt
    }
  }
`

const DELETE_POST = gql`
  mutation DELETE_POST($postId: ID!) {
    deletePost(postId: $postId) {
      title
    }
  }
`

const PostsStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 50px 25px;
  justify-content: center;
`

export const MiniCard = styled.div`
  min-width: 300px;
  min-height: 350px;
  background: ${props => props.theme.cardColor};
  border-radius: 16px;
  box-shadow: ${props => props.theme.boxShadow};
  padding: 23px;
  cursor: pointer;
  font-family: 'Delius', cursive;
  transition: 0.3s ease-out;

  header {
    font-size: 26px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 25px;
  }

  h4 {
    text-align: center;
    font-size: 23px;
    opacity: 0.5;
    color: rgba(241, 196, 15, 1);
  }
  h4.price {
    position: absolute;
    bottom: 56px;
    min-width: 300px;
  }

  footer {
    position: absolute;
    bottom: 16px;
  }
`
const Wrapper = styled.div`
  position: relative;
  button.delete-button {
    position: absolute;
    right: 5px;
    top: 2px;
    border-radius: 31%;
    width: 50px;
    height: 50px;
    font-size: 41px;
    font-weight: bold;
    line-height: 0;
    border: none;
    background: transparent;
    color: #e74c3c;
  }
`

const Post = props => {
  let total = 0
  if (props.total) {
    props.total.map(cost => {
      total += cost.price
    })
  }
  const deletePostfunction = deletePost => {
    const swalWithBootstrapButtons = MySwal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-success'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      })
      .then(async result => {
        if (result.value) {
          await deletePost()
          swalWithBootstrapButtons.fire('Deleted!', 'Your file has been deleted.', 'success')
        } else if (
          // Read more about handling dismissals
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire('Cancelled', 'Your imaginary file is safe :)', 'error')
        }
      })
  }
  return (
    <Wrapper>
      <Mutation
        mutation={DELETE_POST}
        variables={{ postId: props.id }}
        refetchQueries={[{ query: ALL_POSTS_QUERY }]}
      >
        {(deletePost, { data, loading, error }) => {
          return (
            <button className='delete-button' onClick={() => deletePostfunction(deletePost)}>
              &times;
            </button>
          )
        }}
      </Mutation>
      <Link href={`/update?id=${props.id}`}>
        <MiniCard>
          <header> {props.title} </header>
          <h4 className='description'>{props.description}</h4>
          <h4 className='price'>Price: {formatMoney(total)}</h4>
          <footer>{moment(props.time).fromNow()}</footer>
        </MiniCard>
      </Link>
    </Wrapper>
  )
}

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Cost Calculator</title>
      </Head>
      <Link href='/create'>
        <Button>Create a new Post</Button>
      </Link>
      <Query query={ALL_POSTS_QUERY}>
        {({ data, loading }) => {
          if (loading) return <p>Loading ...</p>
          if (!data.posts.length)
            return (
              <h1 style={{ textAlign: 'center', fontFamily: 'Delius' }}>
                You have not created any post yet
              </h1>
            )
          return (
            <PostsStyles>
              {data.posts.map(post => (
                <Post
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  total={post.costs}
                  key={post.id}
                  time={post.createdAt}
                />
              ))}
            </PostsStyles>
          )
        }}
      </Query>
    </>
  )
}

export default Dashboard
