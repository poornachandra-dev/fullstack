// import React from 'react'
import { useState,useContext } from 'react';
import './LoginSignup.css';
import { StoreContext } from '../../context/storeContext';
import axios from 'axios';
import Password from '../Password/Password';
import { Link } from 'react-router-dom';
import { CircleX, Mail, User } from 'lucide-react';

const LoginSignup = () => {
    const { setPopUp, currentState, setCurrentState, url, setToken, setUsername } = useContext(StoreContext);

    // State for form data
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null); // Initialize error as null

    // Handler for input changes
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };
    localStorage.setItem('email', data.email);

    // Handler for form submit
    const onLogin = async (e) => {
        e.preventDefault();
        let newUrl = url;

        // Determine if it's login or signup
        if (currentState === 'login') {
            newUrl += '/api/auth/login';
        } else {
            newUrl += '/api/auth/register';
        }

        setError(null); // Clear previous error

        try {
            // Make the API request
            const response = await axios.post(newUrl, data);

            // Check if the response was successful
            if (response.data.success) {
                // Set token and username
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                setPopUp(false);
                setUsername(response.data.name);
                localStorage.setItem('name', response.data.name);

                // Clear form data on successful login/signup
                setData({
                    name: '',
                    email: '',
                    password: '',
                });
            } else {
                // Handle case where success is false
                setError(response.data.message || 'An error occurred');
            }
        } catch (err) {
            // Handle errors
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div className="wrapper">
            {error && (
                <div className="msg">
                    <i className="uis uis-times-circle error_icon"></i>
                    <p>{error}</p>
                </div>
            )}

            <div className="container">
                {/* <i onClick={() => setPopUp(false)} className="uis uis-times-circle form_close" id="reg_cls"></i> */}
                <CircleX className="form_close" onClick={() => setPopUp(false)} size={22} strokeWidth={1.75} />
                <div className="form">
                    <form onSubmit={onLogin} className="rform" method="post">
                        <h2>{currentState === 'signup' ? 'Signup' : 'Login'}</h2>

                        {/* Name input, shown only for signup */}
                        {currentState === 'signup' ? (
                            <div className="input_box">
                                <input
                                    type="text"
                                    name="name"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    id="name-Input"
                                    placeholder="Enter Your Name"
                                    required
                                />
                                <User className='email lg_icon' size={20} strokeWidth={1.75}/>
                            </div>
                        ) : null}

                        {/* Email input */}
                        <div className="input_box">
                            <input
                                type="email"
                                name="email"
                                onChange={onChangeHandler}
                                value={data.email}
                                placeholder="Enter Your Email"
                                required
                            />
                            {/* <i className="uil uil-envelope-alt email"></i> */}
                            <Mail className='email lg_icon' size={20} strokeWidth={1.75}/>
                        </div>

                        {/* Password component */}
                        <Password onChangeHandler={onChangeHandler} pass={data.password} placeholder="Enter your password" />

                        {/* Forgot password link, only for login */}
                        {currentState === 'login' ? (
                            <Link to="/forgot-password" className="forget_pass" onClick={() => setPopUp(false)}>
                                Forgot password?
                            </Link>
                        ) : null}

                        {/* Submit button */}
                        <button type="submit" className="button">
                            {currentState === 'signup' ? 'Create Account' : 'Login Now'}
                        </button>

                        {/* Switch between login/signup */}
                        {currentState === 'signup' ? (
                            <div className="login_singnup">
                                Already Have An Account? <span 
                                                            onClick={() => {
                                                                setCurrentState('login');
                                                                setError(null);
                                                                setData({
                                                                    name: '',
                                                                    email: '',
                                                                    password: '',
                                                                });
                                                        }}>
                                                        Login</span>
                            </div>
                        ) : (
                            <div className="login_singnup">
                                Don't Have An Account? <span onClick={() => {setCurrentState('signup');setError(null)}}>SignUp</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
