import React, {useState, useEffect} from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Image, ListGroup, Card, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {listProductDetails, createProductReview} from '../actions/productAction'
// import products from '../product'
import axios from 'axios'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'


function ProductScreen( {match, history}) {
    const dispatch = useDispatch()
    
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const productReview = useSelector(state => state.productReview)
    const { loading: loadingProductReview, error: errorProductReview, success: successProductReview } = productReview
    

   const [qty, setQty] = useState(1)
   const [comment, setComment] = useState('')
   const [rating, setRating] = useState(0)
    // const product = products.find((p) => p._id === match.params.id )
    
    // const [product, setproduct] = useState([])

    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({type:PRODUCT_CREATE_REVIEW_RESET})
        }
        dispatch(listProductDetails(match.params.id))

    //    async function fatchProducts(){
    //     const {data} = await axios.get(`/api/products/${match.params.id}`)
    //     setproduct(data)
    //    }

    //    fatchProducts()
    }, [dispatch, match, successProductReview])

    const addToCartHandler= () =>{
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log('click')
        dispatch(createProductReview(
            match.params.id,{
            rating,
            comment
        }))
        
    }
    
    return (
        <div>
           <Link to='/' className='btn btn-light my-3'>Go Back</Link>

           {
               loading ? <Loader/>
               : error ? <Message variant='danger'>{error}</Message>
               :(
               <div>
               <Row>
               <Col md={6}>
                   <Image src={product.image} alt={product.name} fluid/>
               </Col>
               <Col md={3}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} Reviews`} color={'#f8e825'}/>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Price: ${product.price}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            Description: {product.description}
                        </ListGroup.Item>

                    </ListGroup>
               </Col>
               <Col md={3}>
                   <Card>
                       <ListGroup variant='flush'>
                           <ListGroup.Item>
                               <Row>
                                   <Col>Price:</Col>
                                   <Col><strong>${product.price}</strong></Col>
                               </Row>
                           </ListGroup.Item>
                       
                       <ListGroup.Item>
                               <Row>
                                   <Col>Status:</Col>
                                   <Col>{product.countInStock > 0? 'In Stock' : 'Out of Stock'}</Col>
                               </Row>
                           </ListGroup.Item>

                           {product.countInStock > 0 && (
                               <ListGroup.Item>
                                   <Row>
                                       <Col>Qty</Col>
                                       <Col xs='auto' className='my-1'>
                                            <Form.Control as='select' value={qty}
                                            onChange = {(e) => setQty(e.target.value)}
                                            >
                                                {
                                                    // to create an array from a number and mapping it
                                                    [...Array(product.countInStock).keys()].map((x) =>
                                                        <option key={x+1} value={x+1}>
                                                            {x+1}
                                                        </option>
                                                    )
                                                }
                                            </Form.Control>
                                       </Col>
                                   </Row>

                               </ListGroup.Item>
                           )}

                       <ListGroup.Item>
                          
                           <Button className='btn btn-block' disabled={product.countInStock=== 0} type='button'
                            onClick={addToCartHandler}
                           > Add to Cart</Button>
                       </ListGroup.Item>
                       </ListGroup>
                   </Card>
               </Col>
           </Row>
           
                <Row>
                                <Col md={6}>
                                    <h4>Reviews</h4>

                                        {product.reviews.length === 0 && <Message variant='info'>No Review</Message>}
                                        
                                        <ListGroup variant='flush'>
                                            {product.reviews.map((review) => (
                                                <ListGroup.Item key={review._id}>
                                                    <strong>{review.name}</strong>
                                                    <Rating value={review.rating} color='#f8e825' />
                                                    <p>{review.createdAt.substring(0, 10)}</p>
                                                    <p>{ review.comment}</p>

                                                </ListGroup.Item>
                                            ))}
                                            <ListGroup.Item>
                                                <h4>rewite a review</h4>
                                                {loadingProductReview && <Loader />}
                                                {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                                {errorProductReview && <Message variant='success'>{errorProductReview}</Message>}
                                                
                                                {userInfo ? (
                                                    <Form onSubmit={submitHandler}>
                                                        <Form.Group controlId='rating'>
                                                            <Form.Control
                                                                as='select'
                                                                value={rating}
                                                                onChange={(e) => setRating(e.target.value)}
                                                            >
                                                                <option value=''>Select...</option>
                                                                <option value='1'>1 - Poor</option>
                                                                <option value='2'>2 - Fair</option>
                                                                <option value='3'>3 - Good</option>
                                                                <option value='4'>4 - very Good</option>
                                                                <option value='5'>5 - Excellent</option>

                                                            </Form.Control>
                                                        </Form.Group>

                                                        <Form.Group controlId='comment'>
                                                            <Form.Label>Review</Form.Label>
                                                            <Form.Control
                                                                as='textarea'
                                                                row='5'
                                                                value={comment}
                                                            onChange={(e) => setComment(e.target.value)}></Form.Control>
                                                        </Form.Group>

                                                        <Button
                                                            disabled={loadingProductReview}
                                                            type='submit'
                                                            variant='primary'
                                                        >submit</Button>
                                                        

                                                    </Form>
                                                ) : (
                                                        <Message variant='info'>please <Link to='/login'>login</Link> to write a review </Message>
                                                        
                                                )}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    
                                 </Col>
               
                </Row>
           </div>)
           }
           
        </div>
    )
}

export default ProductScreen
