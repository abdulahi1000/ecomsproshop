import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Form, Button, Col, Row, Table} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUsers } from '../actions/userAction'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserUpdateScreen({match, history}) {

    const userId = match.params.id

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate} = userUpdate
    
    useEffect(() => {

        if (successUpdate) {
            dispatch({
                type: USER_UPDATE_RESET
            })
            history.push('/admin/userList/')
        } else {
            if (!user.name || user._id !== Number(userId)) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }
            
        }


        
    }, [dispatch, user, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault()

        dispatch(updateUsers({_id:user._id, name, email, isAdmin}))
    }

    return (
        <div>

            <Link className='btn btn-primary' to='/admin/userList'>Go back</Link>

            <FormContainer>
        
                <h2>Edit User</h2>
               
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            
            {loadingUpdate && <Loader/>}
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                    <Form.Label>Name </Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Enter Name..'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        required
                        type='email'
                        placeholder='Enter Email..'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Col>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin's
                            id='isAdmin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                            
                        
                        >

                        </Form.Check>
                    </Col>
                </Form.Group>

               

                <Button type='submit' variant='primary'> Update</Button>


            </Form>
            </FormContainer>
            </div>
    )
}

export default UserUpdateScreen
