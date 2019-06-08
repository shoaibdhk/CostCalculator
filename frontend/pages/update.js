import React from 'react'
import UpdatePost from '../components/Post/UpdatePost'

const update = props => {
  return (
    <div>
      <UpdatePost postId={props.query.id} />
    </div>
  )
}

export default update
