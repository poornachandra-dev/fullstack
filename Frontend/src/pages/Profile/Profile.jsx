import React, { useContext } from 'react'
import './Profile.css'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../context/storeContext';

const Profile = () => {
  const { setAlertBox } = useContext(StoreContext);

  const handleDelAccount = async() => {
    setAlertBox(true);
    const response = await axios.delete(`${url}/api/delete-account`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if(response.status === 200){
      localStorage.clear();
    }
  }
  return (
    <div className='profile' style={{marginTop : '100px'}}>
        <span className='profile_img'>{localStorage.getItem('name')[0]}</span>

        <div className="profile_name">
            <h3>Name:</h3>
            <p>{localStorage.getItem('name')}</p>
        </div>
        <div className="profile_email">
            <h3>Email:</h3>
            <p>{localStorage.getItem('email')}</p>
        </div>

        <div className='profile_options'>
          <Link to="/change-password" className='change_pass'>Forgot/Change Password</Link>
          {/* <a className='delete_account' onClick={()=>handleDelAccount()}>Delete Account</a> */}
        </div>
        
    </div>
  )
}

export default Profile
