import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Form, Button, Col, Row, Table} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userAction'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { listMyOrders } from '../actions/orderAction'

function ProfileScreen({ history }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

   

    const userDetails= useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin= useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    //to get success message that's why we are getting this
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrder, error: errorOrder,  orders } = orderListMy
    
    

    // to redirect user to where they are  before
    useEffect(() => {
     
        

        if (!userInfo) {
            history.push('/login')
        } else {
            if (!user || !user.name || success ) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
                                
            } else {
                setName(user.name)
                setEmail(user.email)
            }
            
        }
    }, [dispatch, history, userInfo, user] )

    


    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
            setMessage('')
            
        }
        
        
    }
    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                 {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            
            {loading && <Loader/>}
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

                <Form.Group controlId='password'>
                    <Form.Label>password</Form.Label>
                    <Form.Control
                        
                        type='password'
                        placeholder='Enter Password..'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='passwordConfirm'>
                    <Form.Label>Comfirm password</Form.Label>
                    <Form.Control
                        
                        type='password'
                        placeholder='Confirm Password..'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'> Update</Button>


            </Form>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrder ? (
                    <Loader/>
                ) : errorOrder ? (
                        <Message variant='danger'></Message>
                ) :
                        <Table striped responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Paid</th>
                                    <th>Delivered</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{ order._id }</td>
                                        <td>{ order.createdAt.substring(0,10) }</td>
                                        <td>{ order.totalPrice }</td>
                                        <td>{order.isPaid ? order.paidAt.substring(0,10) : (
                                              <i className='fas fa-times' style={{color:'red'}}/>
                                        ) }</td>
                                        <td>
                                            <LinkContainer to={`/order/${order._id}`}>
                                                <Button className='btn-sm'>Details</Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                    </Table>
                }
            </Col>
        </Row>
    )
}

export default ProfileScreen
