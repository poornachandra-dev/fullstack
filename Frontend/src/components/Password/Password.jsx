import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const Password = ({ onChangeHandler,pass,placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="input_box">
            <input type={showPassword ? "text" : "password"} name="password" onChange={onChangeHandler} value={pass} placeholder={placeholder} required />
            <Lock className="password lg_icon" size={20} strokeWidth={1.75}/>
            {/* <i className="uil uil-lock password"></i> */}
            {showPassword 
                ? <Eye className="pw_hide lg_icon" size={20} strokeWidth={1.75} onClick={() => setShowPassword(!showPassword)}/> 
                : <EyeOff className="pw_hide lg_icon" size={20} strokeWidth={1.75} onClick={() => setShowPassword(!showPassword)}/>
            }
        </div>
    )
}

export default Password;
