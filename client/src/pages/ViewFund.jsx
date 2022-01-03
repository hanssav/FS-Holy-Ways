import React, {useState, useEffect, useContext} from 'react'
import { Row, Container } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import Header from '../Components/Header'
import DetailDonate from '../Components/DetailDonate'
import CardDonatur from '../Components/CardDonatur'
import ApproveModal from '../Components/AprovedModal'

import { UserContext } from '../context/UserContext'
import { API } from "../config/api"

function ViewFund(props) {
    let history = useHistory();
    const [state, dispatch] = useContext(UserContext)

    const [fund, setFund] = useState([]);
    const [userDonate, setUserDonate] = useState([]);
    const [idUser, setIdUser] = useState(null)
    const [confirmApprove, setConfirmApprove] = useState(null)

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const [form, setForm] = useState({
        status: ""
    })
    console.log(state)

    const handleApprove = (id) => {
        // console.log("user Id :",id)
        setIdUser(id)
        handleShow()
    }

    const handleChange = (e) => {
        setForm({
          ...form,
            [e.target.name]: e.target.value,
        });
    };
    // console.log("user Id :", idUser)

    const updateStatus = async (id) => {
        // console.log("fundId", fund.id)
        console.log("userId: ", id)

        try {

            const fundId = fund.id
            console.log(fundId)

            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            const formData = new FormData();

            formData.set("status", "success")
            console.log(form)

            const response = await API.put(`/edituserdonate/${fundId}/${id}`, formData, config)
            console.log(response)

            // history.push(`/viewfund/${id}`);
            getFund();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (confirmApprove) {
            handleClose()
            updateStatus(idUser)
            setConfirmApprove(null)
        }
    }, [confirmApprove])

    const getFund = async () => {
        try {
            let id = props.match.params.id

            const response = await API.get(`/getfundsuserdonateone/${id}`);
            setFund(response.data.data)
            setUserDonate(response.data.data.userDonate)
            // console.log(response.data.data)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getFund();
    }, []);

    function convertDate(dateMilli) {
        var d = (new Date(dateMilli) + '').split(' ');
        d[2] = d[2] + ',';

        return [d[0], d[1], d[2], d[3]].join(' ');
    }

    return (
        <div>
            <Header />
            <DetailDonate
                id={fund.id}
                title={fund.title}
                thumbnail={fund.thumbnail}
                goal={fund.goal}
                description = {fund.description}
            />
            <Container>
                <Row className='list-not-aproved mt-5'>
                    <div className="title">
                        <h3>List Donations (10)</h3>
                    </div>
                    <div className="card-list">
                        {
                            userDonate.filter(e => e.payment.status === "success")
                                .map((e) => {
                                    return (
                                        <CardDonatur
                                            id={e.id}
                                            name={e.fullName}
                                            money={e.payment.donateAmount}
                                            date={convertDate(e.payment.createdAt)}
                                            statusPayment={e.payment.status}
                                        />
                                    )
                            })
                        }
                    </div>
                    <Row className="text-center">
                        <p>Load More</p>
                    </Row>
                </Row>
                {state.user.status === "admin" ? (
                    <Row className='list-not-aproved mt-5'>
                        <div className="title">
                            <h3>Donation has not been approved (10)</h3>
                        </div>
                        <div className="card-list">
                            {
                                userDonate.filter(e => e.payment.status === "pending")
                                    .map((e) => {
                                        console.log(e)
                                        return (
                                            <CardDonatur
                                                id={e.id}
                                                name={e.fullName}
                                                money={e.payment.donateAmount}
                                                date={convertDate(e.payment.createdAt)}
                                                idUser={e.id}
                                                nameUser={e.fullName}
                                                status={e.payment.status}
                                                approve={() => handleApprove(e.id)}
                                            />
                                        )
                                    })
                            }
                        </div>
                        <Row className="text-center">
                            <p>Load More</p>
                        </Row>
                    </Row>
                ) : (
                        <div></div>
                     )
                }

            </Container>
            <ApproveModal setConfirmApprove={setConfirmApprove} show={show} handleClose={handleClose}/>
        </div>
    )
}

export default ViewFund
