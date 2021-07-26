import React from "react";
const Home = (props) => {

    const onLogoutClick =()=>{
        localStorage.removeItem('token')
        props.history.push('/')
    }

    return (
        <>
         <div className="container">
         <button onClick={()=>{onLogoutClick()}}>Logout</button>
           <h1>Hey !! Welcome...</h1>
           </div>
        </>
    );
}

export default Home