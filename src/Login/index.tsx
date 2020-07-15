import React, {useState, Component} from 'react';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen } from '@fortawesome/free-regular-svg-icons';
import { faBars, faCaretDown, faCaretLeft, faFire, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
const fire = require('../images/fire.png');
const logo = require('../images/propit.png');



const Login  = () =>  {
  const [error, setError] = useState(false)
  const history = useHistory();
    const details = {
        username: '',
        password: ''
      }

    
      React.useEffect(() => {
       
          if(localStorage.getItem('tokenP')){
            history.push("/Dashboard")
          }    
    
    
      }, []); 
        


   const callApi = () => {
        setError(false)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: {},
            params: details
            
        }


          


        axios.post('http://localhost:3001/login', {
            username: details.username,
            password: details.password
          })
          .then(function (response) {
            console.log(response + "גדשגדשגדש");
            localStorage.setItem('tokenP',response.data)
            
            history.push("/dashboard");
          })
          .catch(function (error) {
            setError(true)
          });
      
    }

  const   handleNameChange = (event) => {
        details.username = event.target.value;
        console.log(details.username)
    }
    const handlePasswordChange = (event) => {
        details.password = event.target.value;
        console.log(details.password)
    }


      return (
      <div className="page">
        <div className="login" id="loginComponent">
        <div> <img style={{maxWidth:'250px'}} src={logo}/></div>
        <div style={{marginBottom: '10px'}}>Username<input onChange={e => {handleNameChange(e)}}/></div>
        <div style={{marginBottom: '10px'}}>Password<input type="password" onChange={e => {handlePasswordChange(e)}}/></div>
        <div><button onClick={() => callApi()}>!התחבר</button></div>
        {error && <div>שם משתמש או סיסמא לא תקינים*</div>}
        </div>
        
        
    </div>);
  
    


}

export default Login;
