import './Home.css'
import Hero from '../../components/Hero/Hero'
import { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/storeContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowUpFromDot } from 'lucide-react'

const Home = () => {
  const [allImages,setAllImages] = useState([]);
  const {url,setPopUp,setCurrentState,setMenuItem,token} = useContext(StoreContext);
  const [error,setError] = useState('');
  const [loading,setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  useEffect(()=>{
    const fetchHomeImages = async()=> {
      setLoading(true);
      try{
        const result = await axios.get(`${url}/api/get-media/get-home-media`);
        setAllImages(result.data.media);
      }catch(error){
        console.log(error);
        setError("Failed to fetch Images");
      }finally{
        setLoading(false);
      }
        
    }
    fetchHomeImages();
  },[]);

  return (
    <>
    <Hero/>
    <section className="home">
    {loading 
      ? 
        <div className="load_container">
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
          <div className="load_item"></div>
        </div> 
      :
        <>
          {error 
            ? ( <div className="error">{error}</div> )
            : 
              <>
                {allImages && (
                  <>
                    <ul className="images_list one">
                        {allImages.map((item,index)=>(
                          <li className="image" key={index}>
                            <img src={item.media_url}
                              onLoad={() => handleImageLoad(index)}
                              className={loadedImages[index] ? 'loaded' : ''}
                              loading="lazy"
                            />
                          </li>
                        ))}
                    </ul>
                    <div className="signup_msg">
                      {!token 
                      ? <>
                          <p>Join us today <br /> to discover an endless collection of breathtaking images!</p>
                          <button className='button' onClick={()=>{setPopUp(true);setCurrentState('signup')}}>Sign Up <ArrowUpFromDot size={20} strokeWidth={2.5} className="link_arrow"/></button>
                        </>
                      :
                        <>
                          <p>Do you like the images? <br /> you can discover breathtaking images by visting the Gallery</p>
                          <Link to='/gallery' className='button' onClick={()=>{setMenuItem('gallery');localStorage.setItem('menu','gallery')}}>Go to Gallery <ArrowUpFromDot size={20} strokeWidth={2.5} className="link_arrow"/></Link>
                        </>
                      }
                    </div>
                  </>
                )}
              </>
          } 
        </>
    }
        
    </section>
    </>
  )
}

export default Home
