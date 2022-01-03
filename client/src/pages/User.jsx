import React from 'react'
import { Container, Row, Col, Image, Card, Button } from 'react-bootstrap'

import Header from "../Components/Header";

import profileImage from "../images/profile.png"


function User() {
    return (
        <div>
            <Header />
            <Container className='my-5'>
                <Row className='profile'>
                    <Col className='profile-image'>
                        <div className='title my-4'>
                            <h3>My Profile</h3>
                        </div>
                        <Row>
                            <Col className='image' md={3}>
                                <Image src={profileImage} rounded />
                            </Col>

                            <Col className='list-bio'>
                                <ul>
                                    <li>
                                        <h4>Full Name</h4>
                                        <p>Andi</p>
                                    </li>
                                    <li>
                                        <h4>Email</h4>
                                        <p>andigans@gmail.com</p>
                                    </li>
                                    <li>
                                        <h4>Phone</h4>
                                        <p>083896833122</p>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>

                    <Col className='history'>
                        <div className='title my-4'>
                            <h3>History Donation</h3>
                        </div>

                        <Card className="mb-5" style={{ width: '30rem' }}>
                            <Card.Body>
                                <Card.Title className="title-card mb-4">The Strength of a People. Power of Community</Card.Title>
                                <Card.Subtitle className=" mb-4"><strong>Saturday</strong>, 12 April 2021</Card.Subtitle>
                                <div className='btn d-flex justify-content-between'>
                                    <Card.Text className="total my-auto">Total : Rp 45.000</Card.Text>
                                    <Button className="button my-auto" variant="outline">Finished</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
         </Container>
        </div>
    )
}

export default User