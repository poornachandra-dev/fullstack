// import React from 'react'
import { useContext, useEffect } from 'react';
import './Navbar.css'
// import Logo from '../../assets/Logo.png'
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LoginSignup from '../LoginSignup/LoginSignup';
import { StoreContext } from '../../context/storeContext';
import axios from 'axios';
import SearchComponent from '../Search/Search';
import { CircleUserRound, Menu, Upload, Search, ChevronDown, UserRoundCog, Heart, MoonStar, Sun, LogOut, House, Image, Sparkles, Info, ImageUp, FileUp, ArrowUpFromDot, CircleX } from 'lucide-react';


const Navbar = () => {
  const { popUp, setPopUp, setCurrentState, url, setMenuItem, token, setToken, username, setUsername, alertBox, setAlertBox, imgId, myImages, setMyImages, setTheme } = useContext(StoreContext);
  const [showMenu, setShowMenu] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [headStyle, setHeadStyle] = useState({
    backgroundColor: 'transparent',
    boxShadow: 'none'
  });


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 65) {
        setHeadStyle({
          backgroundColor: 'var(--background-color)',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
        });
      } else {
        setHeadStyle({
          backgroundColor: 'var(--background-color)',
          boxShadow: 'none'
        });
      }

      if (localStorage.getItem('menu') === 'home' && window.scrollY < 65) {
        setHeadStyle({
          backgroundColor: 'transparent',
          boxShadow: 'none'
        })
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (popUp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    }
  }, [popUp]);




  const navigate = useNavigate();

  const logout = () => {
    setMenuItem('home');
    localStorage.setItem('menu', 'home');
    localStorage.removeItem('token');
    setToken('');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUsername('');
    navigate('/');

  }

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${url}/api/delete/${imgId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data.message);
      setMyImages(myImages.filter((img) => img._id !== imgId));
      setAlertBox(false);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

  return (
    <header style={headStyle}>
      {alertBox
        &&
        <div className="alert">
          <p>Are you sure you want to delete it?</p>
          <div className="alert_controls">
            <button onClick={() => handleDelete()}>Yes</button>
            <button onClick={() => setAlertBox(false)}>No</button>
          </div>
        </div>
      }

      {popUp ? <LoginSignup setPopUp={setPopUp} /> : <></>}
      <nav>
        <div className="menu_toggle" onClick={() => setShowMenu('show_menu')}>
          {/* <i className="ri-menu-2-fill"></i> */}
          <Menu size={30} strokeWidth={2} />
        </div>
        <Link to='/' onClick={() => { setMenuItem('home'); localStorage.setItem('menu', 'home') }}>
          <div className="logo">
            {/* <img src={Logo} alt="" /> */}
            <p>ArtSpire</p>
          </div>
        </Link>
        <div className={`nav ${showMenu}`} >
          <span className="menu_close_icon" onClick={() => setShowMenu('')}><CircleX size={34} strokeWidth={1.75} /></span>
          <ul className="nav_items">
            <Link to='/'
              className={`nav_item ${localStorage.getItem('menu') === 'home' ? 'active' : ''}`}
              onClick={() => { setMenuItem('home'); setShowMenu(''); localStorage.setItem('menu', 'home') }}
            ><House size={20} strokeWidth={1.75} className='menu_icons'/> Home <ArrowUpFromDot size={18} strokeWidth={2} className="link_arrow"/>
            </Link>
            <Link to='/about'
              className={`nav_item ${localStorage.getItem('menu') === 'about' ? 'active' : ''}`}
              onClick={() => { setMenuItem('about'); setShowMenu(''); localStorage.setItem('menu', 'about') }}
            ><Info size={20} strokeWidth={1.75} className='menu_icons'/> About <ArrowUpFromDot size={18} strokeWidth={2} className="link_arrow"/>
            </Link>
            <Link to='/ai-gen'
              className={`nav_item ${localStorage.getItem('menu') === 'aigen' ? 'active' : ''}`}
              onClick={() => { setMenuItem('aigen'); setShowMenu(''); localStorage.setItem('menu', 'aigen') }}
            ><Sparkles size={20} strokeWidth={1.75} className='menu_icons'/>AiGen <ArrowUpFromDot size={18} strokeWidth={2} className="link_arrow"/>
            </Link>
            <Link to='/gallery'
              className={`nav_item ${localStorage.getItem('menu') === 'gallery' ? 'active' : ''}`}
              onClick={() => { setMenuItem('gallery'); setShowMenu(''); localStorage.setItem('menu', 'gallery') }}
            ><Image size={20} strokeWidth={1.75} className='menu_icons'/> Gallery <ArrowUpFromDot size={18} strokeWidth={2} className="link_arrow"/>
            </Link>
          </ul>
        </div>
      </nav>
      <div className="nav_controlls">
        {!token
          ? <>
            <button onClick={() => { setPopUp(true); setCurrentState('login') }} className='Login'>Login</button>
            <button onClick={() => { setPopUp(true); setCurrentState('signup') }} className='Signup'>Signup</button>
          </>
          :
          <>
            {localStorage.getItem('menu') === 'gallery' ? <span className='search_icon' onClick={() => setSearchOpen(true)}><Search size={24} strokeWidth={2.5} /></span> : <></>}
            <Link to='/upload' ><button className='upload_btn' onClick={() => localStorage.setItem('menu', '')}><FileUp size={20} strokeWidth={1.75} />Upload</button></Link>
            <div className="user_info">
              <div>
                <span><CircleUserRound size={24} strokeWidth={2} /></span>
                <span className='name'>{username}</span>
                <span><ChevronDown size={24} strokeWidth={2} /></span>
              </div>
              <ul className="user_info_settings">
                <Link to='/profile' className="user_option"><span><UserRoundCog size={20} strokeWidth={1.75} /></span> Profile</Link>
                <Link to='/favourites' className="user_option" onClick={() => localStorage.setItem('menu', '')}><span><Heart size={20} strokeWidth={1.75} /></span> My Favorites</Link>
                <Link to='/my-uploads' className="user_option" onClick={() => localStorage.setItem('menu', '')}><span><Upload size={20} strokeWidth={1.75} /></span> My Uploads</Link>
                <li className="user_option theme">
                  <span className={`light_mode ${localStorage.getItem('theme') === 'light' ? 'active' : ''}`} onClick={() => {
                    setTheme('light');
                    localStorage.setItem('theme', 'light');
                  }}><Sun size={20} strokeWidth={1.75} />
                  </span>
                  <span className={`dark_mode ${localStorage.getItem('theme') === 'dark' ? 'active' : ''}`} onClick={() => {
                    setTheme('dark');
                    localStorage.setItem('theme', 'dark');
                  }}>
                    <MoonStar size={20} strokeWidth={1.75} />
                  </span>
                </li>
                <li className="user_option logout" onClick={logout}><span><LogOut size={20} strokeWidth={1.75} /></span> Logout</li>
              </ul>
            </div>
          </>
        }

      </div>
      {searchOpen ? <SearchComponent searchOpen={searchOpen} setSearchOpen={setSearchOpen} /> : <></>}

    </header>
  )
}

export default Navbar
