import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";

import 'bootstrap/dist/css/bootstrap.min.css';

import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import PrivateRoute from "./componentRoutes/PrivateRoutes";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import RaiseFund from "./pages/RaiseFund";
import DetailDonations from "./pages/DetailDonations";
import FormFund from "./pages/FormFund";
import FormUpdate from "./pages/FormUpdate";
import ViewFund from "./pages/ViewFund";

import { API, setAuthToken } from "./config/api"

if (localStorage.token) {
    setAuthToken(localStorage.token)
}

function App() {
    const history = useHistory();

    // Init user context here ...
    const [state, dispatch] = useContext(UserContext)
    // console.log(state.user)

    // Redirect Auth here ...
    useEffect(() => {
        if (state.isLogin === false) {
            // history.push("/")
            <Link to="/" />
        } else {
            if (state.user.status === "admin") {
                // history.push("/raisefund")
                <Link to="/raisefund" />
            } else if (state.user.status === "user") {
                // history.push('/')
                <Link to="/" />
            }
        }
    }, [state, history])


    // Create function for check user token
    const checkUser = async () => {
        try {
            const response = await API.get('/check-auth')

            if (response.status === 404) {
                return dispatch({
                    type: "AUTH_ERROR"
                })
            }

            let payload = response.data.data.user
            payload.token = localStorage.token

            dispatch({
                type: "USER_SUCCESS",
                payload
            })

        } catch (error) {
            // console.log(error);
        }
    }

    // Call function check user with useEffect didMoun
    useEffect(() => {
        checkUser()
    });

  return (
    <Router>
      <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/user" component={User} />
            <PrivateRoute exact path="/raisefund" component={RaiseFund} />
            <Route exact path="/detaildonations/:id" component={DetailDonations} />
            <PrivateRoute exact path="/formfund" component={FormFund} />
            <PrivateRoute exact path="/formupdate/:id" component={FormUpdate} />
            <PrivateRoute exact path="/formfund/:id" component={FormFund} />
            <Route exact path="/viewfund/:id" component={ViewFund} />
        </Switch>
    </Router>

  )
}

export default App;