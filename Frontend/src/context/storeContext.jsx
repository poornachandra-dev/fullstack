import { createContext, useEffect, useState } from "react";


export const StoreContext = createContext(null);

const StoreContextProvider = (props)=>{
    
    const url = 'http://localhost:3000'
    const [token,setToken] = useState("");
    const [username,setUsername] = useState("");
    const [popUp,setPopUp] = useState(false);
    const [currentState,setCurrentState] = useState('signup');
    const [menuItem,setMenuItem] = useState('home');
    const [alertBox,setAlertBox] = useState(false);
    const [imgId,setImgId] = useState('');
    const [myImages,setMyImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme,setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [imageShow,setImageShow] = useState(false);
    const [shownImageData,setShownImageData] = useState({});

    useEffect(()=>{
        if(localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
            setUsername(localStorage.getItem('name'))
        }
    },[])

    const contextValue = {
        popUp,
        setPopUp,
        currentState,
        setCurrentState,
        menuItem,
        setMenuItem,
        url,
        token,
        setToken,
        username,
        setUsername,
        alertBox,
        setAlertBox,
        imgId,
        setImgId,
        myImages,
        setMyImages,
        searchQuery,
        setSearchQuery,
        theme,
        setTheme,
        shownImageData,
        setShownImageData,
        imageShow,
        setImageShow
    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;

