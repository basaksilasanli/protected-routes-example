import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import './App.css'

const fakeAuth = {
    isAuthenticated: false,
    authenticate(callBack) {
      this.isAuthenticated = true;
      setTimeout(callBack,100) //fake async
    },
    signout(callBack) {
      this.isAuthenticated = false;
      setTimeout(callBack,100)  // fake async
    }
  }
 
//Components 
const Public = () => <h3>Public</h3>

const Protected = () => <h3>Protected</h3>

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  }
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState(() => ({
        redirectToReferrer:true
      }))
    })
  }
  render() {
    const {from} = this.props.location.state || {from: {pathname:'/'}}
    const {redirectToReferrer} = this.state

    if (redirectToReferrer === true) {
      return <Redirect to= {from} />
    }
    return(
      <div>
        <h3>Login Page</h3>
        <p>You must log in to view the page</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    fakeAuth.isAuthenticated === true 
    ? <Component {...props}/>
    : <Redirect to = {{ 
        pathname: '/login', 
        state: {from: props.location}
       }} 
       />
  )} />
)

const AuthButton = withRouter(({ history }) => (
  fakeAuth.isAuthenticated ? (
    <p>
      Welcome! <button onClick={() => {
        fakeAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
))

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <div>
            <AuthButton></AuthButton>
            <Link to="/public">Public Page</Link> 
            <Link to="/protected">Protected Page</Link>   
           
            <Route path="/public" component={Public}/>
            <Route path="/login" component={Login}/>
            <PrivateRoute path="/protected" component={Protected}></PrivateRoute>
          </div>
        </BrowserRouter>

      
    );
  }
}

export default App;
