import React from 'react'
import styled from 'styled-components'

const StyledError = styled.div`
  border-left: 3px solid red;
  background-color: ${tp => tp.theme.white};
  padding: 15px;
  background-color: #ff000030;
  color: ${tp => tp.theme.black};
`

const Errors = props => {
  return props.error ? <StyledError {...props}>{props.error}</StyledError> : null
}

export default Errors
