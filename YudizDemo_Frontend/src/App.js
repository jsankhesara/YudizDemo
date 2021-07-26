import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup"
import Home from "./Home"
import io from "socket.io-client";


const socket_url = 'localhost:3001'

export const socket = io.connect(socket_url, {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: 5
});
socket.on('connect', (param) => {
});
socket.on('disconnect', (reason) => {
  localStorage.removeItem('token')
});
socket.on('reconnect', (reason) => {
});

const App =()=> {
  React.useEffect(()=>{
    socket.on('user-logout', (param) => {
      let token = localStorage.getItem('token')
      if(token !== null){
        alert('Another user logged in !!!')
        window.location.href = '/'
        localStorage.removeItem('token')
      }else{
        localStorage.removeItem('token')
      }
      
    });
  },[])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path={`/`} component={Login} />
          <Route exact path={`/signup`} component={Signup} />
          <Route exact path={`/home`} component={Home} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;