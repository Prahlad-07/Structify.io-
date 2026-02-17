import React, { useState } from 'react';
import UserService from '../service/UserService'
import { useNavigate } from 'react-router-dom';
import '../css/login.scss';

export default function Login() {
  const navigate=useNavigate();
  const [view,setView] = useState("logIn");
  const [passAlert,setPassAlert] = useState("");
  const [loginModel,setLoginModel] = useState({mail:"",password:""});
  const [registerModel,setRegisterModel] = useState({mail:"",password:"",name:"",surname:""});
  const [response,setResponse] = useState({success:"",message:""});
  /*{
      currentView: "logIn",
      passAlert: "",
      login:{
        mail:"",
        password:""
      },
      response:{
        success:"",
        message:"",
      },
  
      register:{
        mail:"",
        password:"",
        name:"",
        surname:""
      },
  
     
    } */
  
  const changeView = (view) => {
    setView(view);
    setPassAlert("");
    setResponse("");

    document.querySelectorAll('form').forEach((item) => {item.reset()})
    
  }
  const currentView = () => {
    switch(view) {
      case "signUp":
        return (            
          <form>
            <h2>Sign Up!</h2>
            <fieldset>
              <legend>Create An Account</legend>
              <ul>
                <li>
                  <label htmlFor="mail">Mail:</label>
                  <input
                    id="mail"
                    onInput={(e) => handle(e,registerModel)}
                    maxLength={50}                  
                    required/>
                </li>
                <li>
                  <label htmlFor="name">Name:</label>
                  <input 
                    onChange={(e) => handle(e,registerModel)} 
                    type="text" 
                    id="name"
                    maxLength={40}
                    required/>
                </li>
                <li>
                  <label htmlFor="surname">Surname:</label>
                  <input 
                    onChange={(e) => handle(e,registerModel)} 
                    type="text" 
                    id="surname" 
                    maxLength={40}
                    required/>
                </li>
                <li>
                  <label htmlFor="password">Password:</label>
                  <input
                    onChange={(e) => {handlePassword(e); handle(e,registerModel)}}
                    type="password" 
                    id="password"
                    minLength={8}
                    maxLength={40}
                    required/>
                </li>
                <li>
                  <label htmlFor="repassword">Repassword:</label>
                  <input 
                    onChange={(e) => handlePassword(e)}
                    type="password"
                    id="repassword" 
                    maxLength={40}
                    required/>   
                </li>
                <label id="registerAlert" style={{color:getColor()}} >{getResponse().message}</label>
                <label id="passAlert" className='text-danger' >{getPassAlert()}</label>
              </ul>
             
            
            </fieldset> 
            <>
              <button 
                id="registerBtn" 
                onClick={(e)=>register(e)} >Register</button>

              <button type="button" onClick={ () => changeView("logIn")}>Have an Account?</button>
            </>
          </form>
        )
        
      case "logIn":
            return (
            <form onSubmit={()=>{return false}}>
                <h2>Welcome To Data Structures Course!</h2>
                <fieldset>
                <legend>Log In</legend>
                <ul>
                    <li>
                    <label htmlFor="mail">Mail:</label>
                    <input 
                      onInput={(e) => {handle(e,loginModel)}} 
                      id="mail" 
                      type="email"
                      maxLength="50" 
                      required/>
                    </li>
                    <li>
                    <label htmlFor="password">Password:</label>
                    <input 
                      type="password" 
                      id="password"  
                      onInput={(e) => {handle(e,loginModel)}}required/>
                    </li>
                    
                </ul>
                </fieldset>
                <label style={{color:getColor()}}>{getResponse().message}</label>
                <button 
                  id="loginBtn" 
                  onClick={(e) => {login(e)}}>Login</button>

                <button type="button" onClick={() => changeView("signUp")}>Create An Account</button>
                <a className='btn' style={{backgroundColor: 'blueviolet', color: 'white'}}
                  onClick={(e) => {navigate('/freespace')}}>Go To Free Space</a>
            </form>
        )
      default:
        break
    }

    
  }
  const login = async (e) => {
    e.preventDefault();

    if(validate()) {
      try {
        await UserService.login(loginModel.mail, loginModel.password);
        const res = UserService.getResponse();
        setResponse(res);
        
        if(res && res.success === true) {
          setTimeout(() => {
            navigate("/courseMain", { state: true });
          }, 1500);
        } else {
          setResponse({
            success: false,
            message: res?.message || "Login failed. Please try again."
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        setResponse({
          success: false,
          message: "An error occurred. Please try again later."
        });
      }
    }
  }
  const register = async (e) => {
    e.preventDefault();
    
    if(validate()) {
      try {
        await UserService.register(
          registerModel.name,
          registerModel.surname,
          registerModel.mail,
          registerModel.password
        );
        
        const res = UserService.getResponse();
        setResponse(res);
        
        if(res && res.success === true) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setResponse({
            success: false,
            message: res?.message || "Registration failed. Please try again."
          });
        }
      } catch (error) {
        console.error("Register error:", error);
        setResponse({
          success: false,
          message: "An error occurred during registration. Please try again later."
        });
      }
    }
  }
  const handle = (e, whichModel) => {
    whichModel[e.target.id] = e.target.value;
  }

  const handlePassword = (e) => {
    const { id, value } = e.target;
    const password = id === "password" ? value : registerModel.password;
    const rePassword = id === "repassword" ? value : document.getElementById("repassword")?.value || "";
    
    const isEqual = password !== rePassword;
    
    if(isEqual) {
      setPassAlert("***Passwords do not match");  
    } else {
      setPassAlert("");
    }

    if(view === "signUp") {
      const registerBtn = document.getElementById("registerBtn");
      if(registerBtn) {
        registerBtn.disabled = isEqual;
      }
    }
  }

  const validate = () => {
    let valid = true;
    const inputs = document.querySelectorAll("input");
    
    inputs.forEach((input) => {
      if(!input.validity.valid) {
        valid = false;             
      }            
    });
    return valid;
  }

  const getPassAlert = ()=>{
    return passAlert;
  }
  const getResponse = () => {
    return response;
  }
  const getColor = () => {
    let res=getResponse();
    
    return res.success ? 'green' : 'red';
  }
  
  return (
    <section id="entry-page">
      {currentView()}
      
    </section>
  );
}
