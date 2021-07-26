import React from "react";
import { API } from '../service/service'
import { Toast } from 'primereact/toast';

let errorMessage = {
    'email': 'Email is required',
    'password': 'Password is required'
}

const Login = (props) => {
    const [userData, setUserData] = React.useState({
        'email': '',
        'password': '',
        'phoneNumber': ''
    })
    const [errObj, setErrObj] = React.useState({})
    const toast = React.useRef(null);

    React.useEffect(() => {
        localStorage.removeItem('token')
    }, [])

    const onClickSignup = () => {
        props.history.push('/signup')
    }

    const onLoginClick = () => {
        let isValid = handleValidation()
        if (isValid) {
            let user = {
                "email": userData.email,
                "password": userData.password
            }
            API.Login(user).then((res) => {
                if (res.is_error) {
                    toast.current.show({ severity: 'error', summary: 'Error Message', detail: res.message });
                } else {
                    props.history.push('/home')
                    debugger
                    localStorage.setItem('token', res.data.authToken)
                }
            })
        }

    }

    const handleValidation = () => {
        let isValid = true
        if (userData.email === '') {
            isValid = false
            errObj.email = errorMessage.email
        }
        if (userData.password === '') {
            isValid = false
            errObj.password = errorMessage.password
        }
        setErrObj({ ...errObj })
        return isValid
    }

    const onHandleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
        setErrObj({ ...errObj, [e.target.name]: '' })
    }

    return (
        <>
            <Toast ref={toast} />
            <div className="container">
                <label>Login Form</label>
            </div>
            <div className="container">
                <label for="uname"><b>Email</b></label>
                <input type="text" value={userData.email} placeholder="Enter Email" name="email" autoComplete="off" onChange={(e => { onHandleChange(e) })} />
                <p className='error-msg'>{errObj.email}</p>
                <label for="psw"><b>Password</b></label>
                <input type="password" value={userData.password} placeholder="Enter Password" name="password" autoComplete="off" onChange={(e => { onHandleChange(e) })} />
                <p className='error-msg'>{errObj.password}</p>
                <button type="submit" onClick={() => { onLoginClick() }}>Login</button>
                <button type="submit" onClick={() => { onClickSignup() }}>Signup</button>
            </div>
        </>
    );
}

export default Login