import styled from 'styled-components'
import Button from '../styled/Button'
import formatMoney from '../../lib/formatMoney'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import gql from 'graphql-tag'
import { Spinner, Col, Row, Form, FormGroup, Input, FormFeedback, Container } from 'reactstrap'
import { ALL_POSTS_QUERY } from '../layout/Dashboard'
import catchErrors from '../../lib/catchError'
import Swal from 'sweetalert2'

const Wrapper = styled.div`
  background: ${props => props.theme.cardColor};
  border-radius: 16px;
  box-shadow: ${props => props.theme.boxShadow};
  padding: 23px;
  font-family: 'Delius', cursive;
  h1 {
    text-align: center;
    margin: 20px 0;
  }
  input {
    height: 62px;
    padding: 0 20px 0 23px;
    background: transparent;
    color: #f1c40f;
    font-size: 16px;
    outline: none;
    border: 1px solid yellow;
    border-radius: 20px;
    box-shadow: 0 3px 20px 0px #f1c40f;
    &[type='number'] {
      -moz-appearance: textfield;
    }
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }
    &:focus,
    &:active {
      background: transparent;
      color: #f1c40f;
    }
  }

  button.close-button {
    position: relative;
    right: -20px;
    top: 8%;
    width: 50px;
    height: 50px;
    opacity: 0.3;
    border-radius: 50%;
    border: none;
    background: #f1c40f;
    transition: 0.2s ease-out;
    &:hover {
      opacity: 1;
    }
    &:before,
    &:after {
      position: absolute;
      left: 50%;
      content: ' ';
      height: 33px;
      width: 2px;
      background-color: #333;
      top: 17%;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
`

const CREATE_POST = gql`
  mutation CREATE_POST($title: String!, $description: String!, $costs: [Costcalculate!]!) {
    createPost(title: $title, description: $description, costs: $costs) {
      id
      costs {
        title
        price
      }
    }
  }
`

class CreatePost extends React.Component {
  state = {
    title: '',
    description: '',
    costs: [{ title: '', price: undefined }],
    total: 0
  }
  onChange = e => {
    return this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    let { title, description, costs, total } = this.state
    return (
      <Wrapper>
        <h1>Create A New Post</h1>
        <Mutation
          mutation={CREATE_POST}
          variables={this.state}
          refetchQueries={[{ query: ALL_POSTS_QUERY }]}
        >
          {(createPost, { data, loading, error }) => {
            let errorMessage = catchErrors(error)
            return (
              <Container>
                <Row>
                  <Col md={10} className='mx-auto'>
                    <Form
                      method='post'
                      onSubmit={async e => {
                        e.preventDefault()
                        let costs = this.state.costs
                        costs.map(cost => {
                          if (cost.price === undefined) {
                            cost.price = 0
                          }
                        })
                        this.setState({ costs })
                        const post = await createPost()
                        if (post) return Router.push('/')
                      }}
                    >
                      <FormGroup className='post-input'>
                        <Input
                          type='text'
                          value={title}
                          placeholder='Please enter you title'
                          name='title'
                          onChange={this.onChange}
                          invalid={errorMessage && errorMessage.title ? true : false}
                        />
                        {errorMessage && errorMessage.title && (
                          <FormFeedback>{errorMessage.title}</FormFeedback>
                        )}
                      </FormGroup>
                      <FormGroup className='post-input'>
                        <Input
                          type='text'
                          value={description}
                          placeholder='Please enter a description'
                          name='description'
                          onChange={this.onChange}
                          invalid={errorMessage && errorMessage.description ? true : false}
                        />
                        {errorMessage && errorMessage.description && (
                          <FormFeedback>{errorMessage.description}</FormFeedback>
                        )}
                      </FormGroup>
                      <h1>Total Costs: {formatMoney(total)}</h1>

                      {costs.map((cost, index) => {
                        return (
                          <Row form key={`input_${index}`}>
                            <Col md={6} key={`titleInput_${index}`}>
                              <FormGroup>
                                <Input
                                  type='text'
                                  value={cost.title}
                                  placeholder='What type of cost?'
                                  invalid={
                                    errorMessage &&
                                    errorMessage.costs &&
                                    cost.title === '' &&
                                    errorMessage.costs.includes('title')
                                      ? true
                                      : false
                                  }
                                  name={`costs[${index}].title`}
                                  onChange={e => {
                                    costs[index].title = e.target.value
                                    return this.setState({ costs })
                                  }}
                                />
                                {errorMessage &&
                                  errorMessage.costs &&
                                  cost.title === '' &&
                                  errorMessage.costs.includes('title') && (
                                    <FormFeedback>{errorMessage.costs}</FormFeedback>
                                  )}
                              </FormGroup>
                            </Col>
                            <Col md={5} key={`numberInput_${index}`}>
                              <FormGroup>
                                <Input
                                  type='number'
                                  value={cost.price}
                                  placeholder='Enter the balance'
                                  name={`costs[${index}].price`}
                                  invalid={
                                    errorMessage &&
                                    errorMessage.costs &&
                                    cost.price === 0 &&
                                    errorMessage.costs.includes('price')
                                      ? true
                                      : false
                                  }
                                  onChange={e => {
                                    costs[index].price = parseFloat(e.target.value)
                                      ? parseFloat(e.target.value)
                                      : undefined
                                    return this.setState({ costs })
                                  }}
                                  onBlur={() => {
                                    let total = this.state.total
                                    total = 0
                                    costs.map(cost => {
                                      if (cost.price) total += cost.price
                                    })

                                    this.setState({ total })
                                  }}
                                />
                                {errorMessage &&
                                  errorMessage.costs &&
                                  cost.price === 0 &&
                                  errorMessage.costs.includes('price') && (
                                    <FormFeedback>{errorMessage.costs}</FormFeedback>
                                  )}
                              </FormGroup>
                            </Col>
                            <Col md={1} key={`button_${index}`}>
                              {costs.length > 1 && (
                                <button
                                  className='close-button'
                                  onClick={e => {
                                    e.preventDefault()
                                    costs.splice(index, 1)
                                    let total = this.state.total
                                    total = 0
                                    costs.map(cost => {
                                      if (cost.price) total += cost.price
                                    })

                                    return this.setState({ costs, total })
                                  }}
                                />
                              )}
                            </Col>
                          </Row>
                        )
                      })}
                      <Button
                        className='mt-4'
                        onClick={e => {
                          e.preventDefault()
                          let costs = this.state.costs,
                            isUndefined

                          costs.map(cost => {
                            if (!cost.price && !cost.title) {
                              isUndefined = true
                            }
                          })
                          if (!isUndefined) {
                            errorMessage = {}
                            costs.push({ title: '', price: undefined })
                          } else {
                            Swal.fire({
                              position: 'top-end',
                              type: 'error',
                              title: `You can't leave anything blank`,
                              showConfirmButton: false,
                              timer: 1500,
                              background: '#17141d'
                            })
                          }
                          this.setState({ costs })
                        }}
                      >
                        Add another cost
                      </Button>

                      <Button>{loading ? <Spinner color='info' /> : `Submit`}</Button>
                    </Form>
                  </Col>
                </Row>
              </Container>
            )
          }}
        </Mutation>
      </Wrapper>
    )
  }
}

export default CreatePost
