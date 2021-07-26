import React from "react";
import { API } from '../service/service'
import { Toast } from 'primereact/toast';

let errorMessage = {
    'email': 'Email is required',
    'password': 'Password is required'
}
const Signup = (props) => {

    const [userData, setUserData] = React.useState({
        'email': '',
        'password': '',
        'phoneNumber': ''
    })
    const [errObj, setErrObj] = React.useState({})
    const toast = React.useRef(null);

    const onClickSignup = () => {
        let isValid = handleValidation()
        if (isValid) {
            let user = {
                "email": userData.email,
                "password": userData.password,
                "phoneNumber": userData.phoneNumber
            }

            API.SignUp(user).then((res) => {
                if (res.is_error) {
                    toast.current.show({ severity: 'error', summary: 'Error Message', detail: res.message });
                } else {
                    toast.current.show({ severity: 'success', summary: 'Success Message', detail: res.message });
                    setTimeout(()=>{
                        props.history.push('/')
                    },[500])
                   
                }
            })
        }
    }

    const onLoginClick = () => {
        props.history.push('/')
    }

    const onHandleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
        setErrObj({...errObj ,[e.target.name] :'' })
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
        setErrObj({...errObj})
        return isValid
    }

    return (
        <>
            <Toast ref={toast} />
            <div className="container">
                <label>Register Form</label>
            </div>
            <div className="container">

                <label for="uname"><b>Email</b></label>
                <input type="text" value={userData.email} placeholder="Enter Email" name="email" autoComplete="off" onChange={(e => { onHandleChange(e) })} />
                <p className='error-msg'>{errObj.email}</p>

                <label for="uname"><b>Phone Number</b></label>
                <input type="text" value={userData.phoneNumber} placeholder="Enter Phone Number" name="phoneNumber" autoComplete="off" onChange={(e => { onHandleChange(e) })} />
                <p className='error-msg'>{errObj.phoneNumber}</p>

                <label for="psw"><b>Password</b></label>
                <input type="password" value={userData.password} placeholder="Enter Password" name="password" autoComplete="off" onChange={(e => { onHandleChange(e) })} />
                <p className='error-msg'>{errObj.password}</p>

                <button type="submit" onClick={() => { onClickSignup() }}>Register</button>
                <button type="submit" onClick={() => { onLoginClick() }}>Login</button>
            </div>
        </>
    );
}

export default Signup