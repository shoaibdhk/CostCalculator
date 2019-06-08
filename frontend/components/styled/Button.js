import styled from 'styled-components'

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid ${props => props.theme.yellow};
  background-color: ${props => props.theme.yellow};
  color: ${props => props.theme.brown};
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: block;
  margin: 0 auto 68px;

  &:focus {
    outline: none;
  }
`

export default Button
