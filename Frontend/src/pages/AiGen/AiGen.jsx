import { useContext, useEffect, useState } from 'react'
import './AiGen.css'
import axios from 'axios';
import load from '../../assets/load.svg';
import arrow from '../../assets/arrow.svg'
import { StoreContext } from '../../context/storeContext';
import { ArrowDownToLine, Lightbulb, WandSparkles, X } from 'lucide-react';



const AiGen = () => {
  const { url } = useContext(StoreContext);
  const [userPrompt, setUserPrompt] = useState('');
  const [imgQuantity, setImgQuantity] = useState(4);
  const [loading, setLoading] = useState(true);
  const [genImg, setGenImg] = useState([]);
  const [storedAiImages, setStoredAiImages] = useState([]);
  const [error, setError] = useState('');
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  const genAiImages = async (uPrompt, imgCount) => {
    try {
      const response = await axios.post(`${url}/api/ai-gen/generate-images`,
        {
          userPrompt: uPrompt,
          imgCount: imgCount,
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const { status_url } = response.data;

      const interval = setInterval(async () => {  // Define interval here
        try {
          const statusResponse = await axios.get(`${url}/api/ai-gen/task-status`, {
            params: { statusUrl: status_url },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (statusResponse.data.status === 'COMPLETED') {
            clearInterval(interval);
            const images = statusResponse.data.result.output;

            // Store the images in MongoDB
            await axios.post(`${url}/api/ai-gen/store-images`, { images }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            // setLoading(false);
            setLoadedImages({});
            const loadedImgCards = images.map((imgSrc, index) => (
              <div key={index} className="image_card">
                <img src={imgSrc} alt="Generated content"
                  onLoad={() => handleImageLoad(index)}
                  className={loadedImages[index] ? 'loaded' : ''}
                  loading="lazy"
                />
                <a download href={imgSrc}><span className="img_dwn"><ArrowDownToLine size={20} strokeWidth={1.75} /></span></a>
              </div>
            ))
            setGenImg(loadedImgCards);
            setTimeout(() => {
              setGenImg([]);
            }, 20000);
          } else {
            console.log('Image generation is still in progress...');
          }
        } catch (error) {
          console.error('Error fetching image status:', error);
          clearInterval(interval);  // Clear interval on error
        }
      }, 5000);

    } catch (error) {
      console.error('Error generating images:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const prompt = form[0].value;
    const imgQuant = parseInt(form[1].value, 10);

    setUserPrompt(prompt);
    setImgQuantity(imgQuant);


    const imgCards = Array.from({ length: imgQuant }, (_, index) => (
      <div key={index} className={`image_card load`}>
        {/* <img src={load} alt="Loading" 
          onLoad={() => handleImageLoad(index)}
          className={loadedImages[index] ? 'loaded' : ''}
          loading="lazy"
        /> */}

      </div>
    ));

    setGenImg(imgCards);
    await genAiImages(userPrompt, imgQuantity);
  }

  const handleClose = () => {
    setUserPrompt('');
  }


  useEffect(() => {
    const fetchAIImages = async () => {
      try {
        const result = await axios.get(`${url}/api/get-media/get-aigen-images`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStoredAiImages(result.data.images);
        setLoading(false);
      }
      catch (error) {
        setLoading(false);
        console.log(error);
        setError("Failed to fetch your Generated images");
      }

    }
    fetchAIImages();
  }, [storedAiImages]);


  return (
    <section className="ai-gen">
      <div className="ai-gen_hero">
        <h1 className="ai-gen_hero-title">AI Generated Art</h1>
        <p className="ai-gen_hero_subtitle">Unleashing Boundless Creativity through Artificial Intelligence</p>
        <p className="ai-gen_hero-des">Convert your text into stunning images in seconds with our AI-powered Image Generator. Experience the fusion of technology and artistry, transforming words into captivating visuals.</p>
        <div className="search_box">
          <form className='input_form' onSubmit={(e) => handleSubmit(e)}>
          <Lightbulb size={28} strokeWidth={1.75} />
            <input type="text" className='input_data' placeholder='Enter your idea in text...' value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} />
            {userPrompt.length > 0 ? <X size={24} strokeWidth={1.75} onClick={handleClose}/> : <></>}
            <select value={imgQuantity} onChange={(e) => setImgQuantity(parseInt(e.target.value))}>
              <option value={1}>1 Image</option>
              <option value={2}>2 Images</option>
              <option value={3}>3 Images</option>
              <option value={4}>4 Images</option>
            </select>
            <button className='generate_btn' type='submit'><WandSparkles size={20} strokeWidth={1.75} /> <span>Generate</span></button>
          </form>
        </div>
      </div>
      <div className="ai-gen_images">
        {genImg}
      </div>
      <div className="generated">
        {loading
          ? (
            <span className='load'>
              <svg width="319" height="307" viewBox="0 0 319 307" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M68.7575 50.1298C70.5541 48.8928 72.2259 47.6968 73.8686 46.6728C75.4742 45.6015 77.0387 44.6942 78.4613 43.8331C79.1659 43.3928 79.8751 43.0201 80.5381 42.6458L82.4365 41.5853C82.7419 41.4072 83.0148 41.2772 83.285 41.1402L84.0689 40.7439L85.485 40.0221L86.1166 39.6975L86.8339 39.3442L88.1003 38.7223L90.4225 37.5822C91.3544 37.1168 92.3607 36.5246 93.2328 35.8949C101.95 29.6053 103.918 17.4397 97.6286 8.7222C91.3389 0.00500507 79.1734 -1.96322 70.4558 4.32643L68.358 5.83985L67.2137 6.66541L66.5443 7.14995L65.6974 7.7793L63.8148 9.18573C63.4707 9.44412 63.1267 9.70261 62.7827 9.96119C62.4301 10.2275 62.0554 10.5029 61.7218 10.78C60.9962 11.3663 60.2706 11.9526 59.5448 12.5387C58.7874 13.1577 57.9826 13.7861 57.1825 14.493C55.5692 15.8872 53.8134 17.3715 52.0262 19.0575C50.2015 20.6967 48.3564 22.546 46.4037 24.4683C44.5011 26.4482 42.4993 28.5137 40.5256 30.7731C36.5487 35.2581 32.5004 40.3185 28.6176 45.9122C24.5636 51.7493 20.9033 57.8502 17.661 64.1744C14.2289 70.8694 11.2768 77.7998 8.82713 84.9133C8.49742 85.8087 8.21685 86.7251 7.92561 87.6376L7.05673 90.3777C6.50981 92.2173 6.00102 94.072 5.48675 95.922L4.79662 98.7241C4.57585 99.6602 4.31855 100.585 4.13365 101.531L3.53889 104.352L3.24345 105.761L2.9897 107.179C1.61949 114.647 0.800231 122.206 0.538555 129.795C0.440936 131.657 0.4613 133.517 0.44837 135.359L0.442875 136.739C0.442551 137.198 0.465179 137.657 0.475523 138.115L0.556333 140.851L0.597384 142.21L0.68272 143.563L0.854361 146.252L0.944223 147.69L1.0732 148.962L1.3292 151.49C1.37446 151.914 1.40808 152.318 1.46238 152.756L1.63273 154.081L1.97407 156.704C2.03387 157.136 2.08074 157.575 2.15153 157.998L2.36099 159.262L2.77765 161.765C3.36757 165.077 4.04185 168.29 4.80212 171.386C6.2215 177.177 7.98545 182.877 10.0845 188.457L10.8135 190.365L11.1716 191.302L11.555 192.219L13.0454 195.767C14.095 198.04 15.0463 200.203 16.0687 202.177C18.0237 206.162 19.9615 209.502 21.5661 212.229C23.2214 214.931 24.5438 217.026 25.5087 218.416L26.9542 220.562L25.8898 218.204C25.1758 216.681 24.2257 214.398 23.0621 211.494C21.9491 208.565 20.6232 205.011 19.3946 200.853C18.7348 198.792 18.1756 196.553 17.5437 194.221L16.6994 190.6L16.4838 189.669L16.2953 188.721L15.9129 186.795C14.9093 181.605 14.1131 175.951 13.6861 169.97C13.4702 166.979 13.3541 163.908 13.3305 160.778L13.3402 158.418L13.3448 157.232C13.3454 156.835 13.3719 156.451 13.3842 156.059L13.476 153.711L13.5209 152.533C13.5381 152.136 13.5746 151.7 13.6008 151.284C13.6865 150.014 13.7725 148.744 13.8587 147.474L13.8642 147.394C13.8684 147.584 13.87 147.403 13.8729 147.426L13.8891 147.274L13.9218 146.968L13.9864 146.357L14.245 143.906L14.3743 142.678L14.5472 141.449L14.8928 138.986C14.9532 138.575 15.0011 138.163 15.0722 137.753L15.2887 136.521C15.5826 134.878 15.8408 133.229 16.2129 131.59C17.5724 124.996 19.4153 118.51 21.7264 112.186L22.1518 111.002L22.6163 109.831L23.5405 107.496C23.8336 106.714 24.1967 105.957 24.5209 105.189L25.5161 102.9C26.2298 101.396 26.9287 99.8956 27.6573 98.4177L28.7912 96.2251C29.1684 95.4972 29.5327 94.7664 29.9436 94.0588C32.996 88.4874 36.4407 83.1402 40.2518 78.0577C43.7726 73.3623 47.6036 68.9078 51.7191 64.7239C55.3659 61.0192 59.2293 57.5341 63.2889 54.2871C65.1479 52.772 67.011 51.4241 68.7575 50.1298ZM318.989 147.011L318.989 147.009L318.706 144.438L318.366 141.35L318.144 139.37L317.771 136.735C317.504 134.883 317.209 132.827 316.862 130.623L315.485 123.872C315.262 122.667 314.924 121.442 314.603 120.179L313.601 116.292C313.42 115.63 313.271 114.953 313.058 114.281L312.426 112.24L311.11 108.031L310.771 106.954L310.379 105.879C310.116 105.161 309.85 104.436 309.581 103.703C309.041 102.242 308.502 100.752 307.928 99.2488L306.009 94.7295L305.024 92.4271C304.689 91.6564 304.298 90.9014 303.933 90.1314L301.671 85.4806C301.487 85.0862 301.276 84.7022 301.065 84.3176L300.432 83.1594L299.155 80.8285L297.864 78.4801C297.426 77.6972 296.932 76.9373 296.466 76.1609L293.597 71.4974C289.535 65.3565 285.02 59.2812 280.015 53.5113C274.952 47.7867 269.465 42.3484 263.665 37.3346C257.859 32.4492 251.733 27.9567 245.329 23.8871C238.986 19.9432 232.496 16.5666 226.101 13.6597L221.277 11.6595C220.478 11.3379 219.699 10.9897 218.899 10.6966L216.506 9.83965L214.145 8.99631L212.976 8.57965C212.589 8.43936 212.202 8.30069 211.807 8.18853L207.162 6.78146C206.397 6.55809 205.649 6.30758 204.888 6.11267L202.619 5.5457L198.2 4.44603C196.738 4.14186 195.296 3.86807 193.888 3.58782L191.796 3.17698L190.767 2.97625L189.737 2.82594L185.738 2.24507L183.811 1.96644C183.179 1.87011 182.542 1.83617 181.92 1.76926L178.287 1.4276C177.112 1.32125 175.976 1.19001 174.862 1.16577L168.662 0.899741L163.407 0.935296L161.165 0.953722C160.461 0.983137 159.801 1.03033 159.188 1.06362L156.079 1.24658L153.499 1.39915L156.072 1.68199L159.152 2.02139C159.757 2.09089 160.407 2.15424 161.099 2.24217L163.296 2.59805L168.403 3.43137L174.349 4.7085C175.41 4.9115 176.487 5.22666 177.598 5.52113L181.015 6.43849C181.597 6.60302 182.193 6.73588 182.782 6.93176L184.574 7.51133L188.269 8.70636L189.215 9.01215L190.157 9.36901L192.065 10.0937C193.347 10.5841 194.653 11.0689 195.971 11.5848L199.929 13.3194L201.946 14.2028C202.621 14.5031 203.28 14.8586 203.954 15.1867L208.024 17.2157C208.369 17.3793 208.704 17.5693 209.04 17.7604L210.052 18.3296L212.089 19.4745L214.143 20.6279C214.827 21.0187 215.489 21.4638 216.167 21.8814L220.24 24.4421C225.595 28.0776 230.891 32.0968 235.911 36.5443C240.905 41.0648 245.595 45.9099 249.951 51.0482C254.17 56.1871 258.046 61.5986 261.553 67.2475C264.939 72.8408 267.82 78.5516 270.301 84.1601C270.87 85.5837 271.434 86.9956 271.992 88.394C272.265 89.0941 272.565 89.7752 272.811 90.4769L273.53 92.5748L274.241 94.6422L274.595 95.6643C274.714 96.0028 274.832 96.3405 274.924 96.6877L276.098 100.752C276.285 101.42 276.5 102.072 276.66 102.738L277.126 104.722L278.04 108.578L278.736 112.343L279.074 114.166L279.24 115.062L279.357 115.96L279.817 119.446L280.042 121.123C280.121 121.674 280.139 122.229 280.19 122.771L280.447 125.934C280.527 126.958 280.636 127.945 280.639 128.915L280.806 134.309L280.694 138.56L280.659 140.364L280.548 142.308L280.365 145.409L280.212 147.991C280.158 149.032 280.178 150.199 280.295 151.268C281.471 161.953 291.086 169.662 301.771 168.486C312.456 167.311 320.165 157.696 318.989 147.011ZM274.126 228.456L272.553 230.363C272 231.026 271.441 231.732 270.807 232.431C269.56 233.842 268.239 235.382 266.732 236.942C265.272 238.541 263.618 240.149 261.908 241.857C260.141 243.516 258.305 245.267 256.292 246.985C252.301 250.452 247.803 253.975 242.841 257.344C237.668 260.858 232.266 264.022 226.671 266.816C220.76 269.766 214.647 272.293 208.378 274.377C207.591 274.659 206.783 274.894 205.98 275.14L203.571 275.876C201.952 276.337 200.321 276.763 198.697 277.199C197.877 277.39 197.056 277.582 196.235 277.774C195.412 277.957 194.602 278.178 193.771 278.328L191.294 278.82L190.058 279.067L188.814 279.274C182.264 280.399 175.641 281.04 168.997 281.193C167.369 281.264 165.739 281.222 164.127 281.217L162.92 281.21C162.52 281.206 162.147 281.177 161.761 281.163L159.476 281.061L158.343 281.014L157.051 280.927L154.478 280.753L153.838 280.71L153.518 280.689L153.358 280.678C153.43 280.676 153.086 280.677 153.498 280.671L153.425 280.663L152.264 280.535L149.96 280.283C144.131 279.591 138.354 278.51 132.669 277.046C127.642 275.749 122.697 274.153 117.862 272.265L116.209 271.611L115.398 271.291L114.605 270.947L111.536 269.614C109.573 268.671 107.702 267.829 105.999 266.914C102.557 265.175 99.6789 263.449 97.3276 262.03L96.8951 261.769C96.5231 261.523 96.1506 261.278 95.7777 261.033L94.4472 260.165C94.241 260.031 94.0425 259.902 93.8518 259.779L93.1985 259.341L92.0281 258.553L89.8827 257.107C89.0148 256.531 87.9998 255.954 87.0197 255.511C77.2232 251.086 65.6945 255.44 61.2696 265.237C56.8448 275.034 61.1992 286.562 70.9957 290.987L73.3531 292.052L74.6392 292.633L75.405 292.977L76.3728 293.397C77.0429 293.687 77.7627 293.998 78.5308 294.33L79.7177 294.839L80.3374 295.103L80.9515 295.344C84.255 296.642 88.2717 298.18 92.9726 299.625C95.3048 300.392 97.8348 301.061 100.477 301.799L104.578 302.801L105.632 303.056L106.707 303.282L108.889 303.74C114.77 304.94 121.186 305.911 127.977 306.467C135.059 307.048 142.171 307.156 149.267 306.79L152.026 306.622L153.411 306.536L153.498 306.53C153.963 306.524 153.673 306.524 153.797 306.521L153.956 306.504L154.275 306.472L154.914 306.407L157.48 306.146L158.77 306.015L160.225 305.836L163.139 305.47C163.622 305.405 164.12 305.352 164.589 305.276L165.994 305.047C167.867 304.735 169.746 304.455 171.618 304.056C179.157 302.587 186.578 300.567 193.822 298.011L195.179 297.538L196.523 297.025L199.204 295.998C200.099 295.67 200.971 295.271 201.852 294.909L204.481 293.799C206.211 293.007 207.935 292.225 209.634 291.41L212.157 290.144C212.995 289.721 213.834 289.311 214.65 288.854C221.066 285.435 227.231 281.565 233.098 277.272C238.522 273.303 243.675 268.976 248.523 264.32C252.82 260.191 256.869 255.81 260.648 251.201C262.411 249.086 263.988 246.972 265.496 244.982C266.945 242.941 268.337 241.032 269.54 239.163C270.79 237.332 271.861 235.551 272.868 233.926C273.382 233.12 273.824 232.313 274.264 231.556C274.7 230.797 275.116 230.073 275.51 229.386C277.025 226.603 278.184 224.414 278.907 222.884L280.047 220.562L278.534 222.659C277.569 224.038 276.061 225.998 274.126 228.456Z" fill="#03A800" />
              </svg>
            </span>
          )
          :
          <>
            {
              error ?
                (<div className='error'>{error}</div>)
                :
                <>
                  {storedAiImages.length > 0 || genImg.length > 0
                    ?
                    <>
                      {storedAiImages.length > 0 ? <h2 className='gen_title'>Your creations</h2> : <></>}
                      <div className="ai-gen_images">
                        {storedAiImages.map((item, index) => (
                          <div className="image_card" key={index}>
                            <img src={item.aigen_picture_url}
                              onLoad={() => handleImageLoad(index)}
                              className={loadedImages[index] ? 'loaded' : ''}
                              loading="lazy"
                            />
                            {/* <span className="img_like"><ion-icon name="heart-outline"></ion-icon></span> */}
                            <a download href={item.aigen_picture_url}><span className="img_dwn"><ArrowDownToLine size={20} strokeWidth={1.75} /></span></a>
                          </div>
                        ))}
                      </div>
                    </>
                    :
                    <div className='not_created'>
                      <img src={arrow} className='arrow' />
                      <h3>You have not created your art yet!</h3>
                      <p>Enter the idea above, we will generate it for you....</p>
                    </div>
                  }
                </>
            }
          </>
        }

      </div>
    </section>
  )
}

export default AiGen
