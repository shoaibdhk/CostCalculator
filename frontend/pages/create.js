import React from 'react'
import CreatePost from '../components/Post/CreatePost'
import PleaseSignIn from '../components/auth/PleaseSignIn'
const createAPage = () => {
  return (
    <PleaseSignIn>
      <CreatePost />
    </PleaseSignIn>
  )
}

export default createAPage
