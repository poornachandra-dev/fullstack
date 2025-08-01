// import React from 'react'
import './Footer.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/storeContext'
import { Link } from 'react-router-dom';
import { ArrowUpFromDot, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  
    const {setMenuItem} = useContext(StoreContext);

    return (
    <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="logo">
                        {/* <img src={Logo} alt="" /> */}
                        <p>ArtSpire</p>
                    </div>
                    <p>ArtSpire is your portal to creative expression. Explore, upload, and be inspired by stunning imagery from artists worldwide. Discover the future of art with AI-generated visuals and join a thriving community of art enthusiasts.</p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li onClick={()=>{setMenuItem('about');localStorage.setItem('menu','gallery')}}><Link to="/about">About Us <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></Link></li>
                        <li onClick={()=>{setMenuItem('gallery');localStorage.setItem('menu','gallery')}}><Link to="/gallery">Gallery <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></Link></li>
                        <li onClick={()=>{localStorage.setItem('menu','')}}><Link to="/upload">Upload Your Art <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></Link></li>
                        <li onClick={()=>{setMenuItem('aigen');localStorage.setItem('menu','gallery')}}><Link to="/ai-gen">AI Gen <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></Link></li>
                        <li onClick={()=>{localStorage.setItem('menu','')}}><Link to="/favourites">Favourites <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></Link></li>
                        <li><Link to="/contact">Contact Us <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></Link></li>
                    </ul>
                </div>

                {/* Connect With Us */}
                <div className="footer-section">
                    <h3>Connect With Us</h3>
                    <p>Follow us on social media to stay updated with the latest from ArtSpire.</p>
                    <div className="social-links">
                        <a href="#"><Linkedin size={24} strokeWidth={2} className="social_link"/></a>
                        <a href="https://www.instagram.com/ArtSpire"><Instagram size={24} strokeWidth={2} className="social_link"/></a>
                        <a href="https://www.twitter.com/ArtSpire"><Twitter size={24} strokeWidth={2} className="social_link"/></a>
                        <a href="https://www.facebook.com/ArtSpire"><Facebook size={24} strokeWidth={2} className="social_link"/></a>
                    </div>
                </div>

                {/* Newsletter */}
                {/* <div className="footer-section">
                    <h3>Newsletter</h3>
                    <p>Subscribe to our newsletter to receive updates and exclusive content.</p>
                    <form action="/subscribe" method="post">
                        <input type="email" name="email" placeholder="Enter your email" className="email-input" />
                        <button type="submit" className="subscribe-button">Subscribe</button>
                    </form>
                </div> */}
            </div>

            <div className="footer-bottom">
                <p>
                    <span><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></span> 
                    <span>&copy; 2024 ArtSpire. All rights reserved.</span> 
                    {/* <span>@Made By Poorna Chandra</span> */}
                </p>
            </div>
        </footer>
  )
}

export default Footer
