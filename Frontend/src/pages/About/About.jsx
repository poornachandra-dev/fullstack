// import React from 'react'
import './About.css'
import ab_gallery from '../../assets/about_gallery.jpg';
import ab_upload from '../../assets/about_upload.jpg';
import ab_ai from '../../assets/about_ai.jpg';
import ab_fav from '../../assets/about_fav.jpg';
import { ArrowUpFromDot, Heart, Images, Sparkles, Upload } from 'lucide-react';
const About = () => {
  return (
    <section className='about'>
      <div className="about_head">
        About
        </div>
      <div className="about_description">
        <p>
        At ArtSpire, we believe in the power of visual art to inspire, connect, and transform. <br />
        Our mission is to create a dynamic platform where artists and art enthusiasts from around the 
        world can come together to share, discover, and celebrate creativity in all its forms.
        </p>
      </div>

      <div className="about_features">
        <h1 className="feature_title">Features</h1>
        <div className="about_feature">
          <div className="feature_image">
            <img src={ab_gallery} alt="" />
          </div>
          <div className="feature_desc">
            <div className="feature_icon"><Images size={24} strokeWidth={2} /></div>
            <div className="feature_text">
              <h2>Diverse Gallery</h2>
              <p>Explore an extensive collection of stunning images curated from artists worldwide. 
                Whether you&apos;re seeking inspiration or simply appreciate visual beauty, our gallery offers something for everyone.</p>
            </div>
          </div>
        </div>
        <div className="about_feature">
          <div className="feature_desc">
            <div className="feature_icon"><Upload size={24} strokeWidth={2} /></div>
            <div className="feature_text">
              <h2>User Uploads</h2>
              <p>ArtSpire empowers artists to upload and display their work to a global audience. We provide a space where your creativity can shine, gaining recognition and appreciation from art lovers everywhere.</p>
            </div>
          </div>
          <div className="feature_image">
            <img src={ab_upload} alt="" />
          </div>
        </div>
        <div className="about_feature">
          <div className="feature_image">
            <img src={ab_ai} alt="" />
          </div>
          <div className="feature_desc">
            <div className="feature_icon"><Sparkles fill="#fff" size={24}  strokeWidth={2} /></div>
            <div className="feature_text">
              <h2>AI-Generated</h2>
              <p>Experience the cutting edge of creativity with our AI-generated images. Using advanced algorithms, we produce unique and inspiring visuals that challenge traditional boundaries and open new horizons for artistic expression.</p>
            </div>
          </div>
        </div>
        <div className="about_feature">
          <div className="feature_desc">
            <div className="feature_icon"><Heart fill="#fff" size={24} strokeWidth={2} /></div>
            <div className="feature_text">
              <h2>Favorites and Collections</h2>
              <p>Keep track of your favorite pieces with our favorites feature. Create personalized collections to organize and revisit the images that inspire you the most.</p>
            </div>
          </div>
          <div className="feature_image">
            <img src={ab_fav} alt="" />
          </div>
        </div>
      </div>

      <div className="about_words">
        <h2>Our Community</h2>
        <p>ArtSpire is more than just a gallery—it's a thriving community of artists, photographers, designers, and art enthusiasts. We foster a supportive environment where creativity flourishes, connections are made, and inspiration is shared. Join us to be part of a global network of creative minds.</p>
      </div>
      <div className="footer_hero">
        <div className="left">
          <h2>ArtSpire - Where Creativity Comes Alive!</h2>
          <p>Discover, create, and inspire with ArtSpire. Join our community today and unleash your artistic potential.</p>
        </div>
        <div className="right">
          <button className="btn">Join ArtSpire <ArrowUpFromDot size={20} strokeWidth={2} className="link_arrow"/></button>
        </div>
          
      </div>
    </section>
  )
}

export default About
