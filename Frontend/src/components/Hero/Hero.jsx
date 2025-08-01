// import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/storeContext';
import { ArrowUpFromDot, MoveUp } from 'lucide-react';

const Hero = () => {

  const {setPopUp,setMenuItem,setCurrentState,token} = useContext(StoreContext);
  return (
    <section className='hero'>
        <div className="content_container">
            <h1>Discover<br/>Your Artistic Journey</h1>
            <p>with the world of creativity and inspiration</p>
            <div className="hero_controls">
              <Link to='/gallery' onClick={()=>{setMenuItem('gallery');localStorage.setItem('menu','gallery')}} className="explore">Explore the Collection <ArrowUpFromDot size={20} strokeWidth={2.5} className="link_arrow"/></Link>
              {!token ? <a onClick={()=> {setPopUp(true);setCurrentState('signup')}}>Get Started <ArrowUpFromDot size={20} strokeWidth={2.5} className="link_arrow"/></a> : <></>}
              
            </div>
        </div>
    </section>
  )
}

export default Hero
