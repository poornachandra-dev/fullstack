import React, { useContext, useEffect, useState } from 'react'
import './ForgotPassword.css';
import axios from 'axios';
import { StoreContext } from '../../context/storeContext';
import Password from '../../components/Password/Password';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleX, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const {url,setPopUp,setCurrentState} = useContext(StoreContext);
    const [randomImage,setRandomImage] = useState(null);
    const [email,setEmail] = useState('');
    const [otp,setOtp] = useState(null);
    const [newPassword,setNewPassword] = useState('');
    const [error,setError] = useState(null);
    const [success,setSuccess] = useState(null);
    const [otpSent,setOtpSent] = useState(false);
    const [loading,setLoading] = useState(false);

    const navigate = useNavigate();

    


    useEffect(() => {
        const fetchRandomImage = async () => {
            const response = await axios.get(`${url}/api/get-img/random-image`);
            setRandomImage(response.data.RandomImg);
        }
        fetchRandomImage();
    }, []);

    const handleSendOtp = async () => {
        if(!email){
            setError('Please enter valid email.');
            return;
        }
        setLoading(true);
        setError(null);
        try{
            const response = await axios.post(`${url}/api/auth/forgot-password`,{email});
            setSuccess(response.data.message);
            setOtpSent(true);
        } catch(err){
            setError(err.response?.data?.message || 'Failed to send otp.');
        } finally{
            setLoading(false);
        }
    }

    const handleVerifyAndResetPassword = async () => {
        if(!otp || !newPassword){
            setError('Please enter OTP and new password.');
            return;
        }
        setLoading(true);
        setError(null);
        try{
            const response = await axios.post(`${url}/api/auth/reset-password`,{ email,otp,newPassword });
            setSuccess(response.data.message);
            navigate('/');
            setPopUp(true);
            setCurrentState('login');
        } catch(err){
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally{
            setLoading(false);
        }
    };

  return (
    <div className='forgot' style={{backgroundImage:`linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${randomImage?.url})`}}>
        {randomImage && 
            <p className='uploader'>Photo by <b>{randomImage.uploader}</b></p>
        }
        {(success || error) &&
            <div className="msg">
                {success ? (
                    <>
                        <CircleCheck fill="green" color='#fff' size={30} strokeWidth={1.75} className="success_icon"/>
                        <p>{success}</p>
                    </>
                ) : error ? (
                <>
                        <CircleX fill="red" color='#fff' size={30} strokeWidth={1.75} className="error_icon"/>
                        <p>{error}</p>
                </>
                ) : null}
            </div>
        }
        <div className="forgot_container">
            <h2>Forgot Password</h2>

            {!otpSent ? (
                <>
                    <div className="input_box">
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Enter Your email" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <Mail size={20} strokeWidth={1.75} className='mail_icon'/>
                    </div>
                    <button className="button" onClick={handleSendOtp} disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </>
            ): (
                <>
                    <div className="input_box">
                        <input
                            type="number"
                            name="otp"
                            placeholder="Enter the OTP"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <Lock size={20} strokeWidth={1.75} className="otp"/>
                    </div>

                    <Password placeholder="Enter New Password" onChangeHandler={(e) => setNewPassword(e.target.value)} />

                    <button className="button" onClick={handleVerifyAndResetPassword} disabled={loading}>
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </>
            )}
        </div>
    </div>
  )
}

export default ForgotPassword
