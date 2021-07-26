import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup"
import Home from "./components/Home"
import io from "socket.io-client";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

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

const App = () => {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    socket.on('user-logout', async (param) => {
      let token = localStorage.getItem('token')
      if (token !== null) {
        setVisible(true)
      }
    });
  }, [])

  const onButtonClick = () => {
    setVisible(false)
    localStorage.removeItem('token')
    window.location.href = '/'

  }
  const renderFooter = () => {
    return (
      <div>
        <Button label="Ok" onClick={() => { onButtonClick() }} autoFocus />
      </div>
    );
  }

    return (
      <div className="App">
        <Dialog header="Info" visible={visible} style={{ width: '20vw' }} footer={renderFooter}
        >
          <p>Another user logged In !!</p>
        </Dialog>
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