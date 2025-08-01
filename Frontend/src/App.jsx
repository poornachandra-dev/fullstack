import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import AiGen from './pages/AiGen/AiGen'
import Gallery from './pages/Gallery/Gallery'
import { useContext, useEffect } from 'react'
import { StoreContext } from './context/storeContext'
import NotLoggedIn from './pages/NotLoggedIn/NotLoggedIn'
import ScrollToTop from './components/ScrollToTop'
import Upload from './pages/Upload/Upload'
import Myuploads from './pages/Myuploads/Myuploads'
import Favourites from './pages/Favourites/Favourites'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Profile from './pages/Profile/Profile'
import ImageView from './components/ImageView/ImageView'


function App() {
  const {token,theme} = useContext(StoreContext);

  useEffect(() => {
    document.body.classList.toggle('dark_mode', theme === 'dark');
    localStorage.setItem('theme', theme);
}, [theme]);
  

  return (
    <>
      <ScrollToTop/>
      <Navbar/>
      <ImageView />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/ai-gen' element={!token ? <NotLoggedIn/> : <AiGen/>}/>
        <Route path='/gallery' element={!token ? <NotLoggedIn/> : <Gallery/>}/>
        <Route path='/upload' element={!token ? <NotLoggedIn/> : <Upload/>}/>
        <Route path='/profile' element={!token ? <NotLoggedIn/> : <Profile/>}/>
        <Route path='/favourites' element={!token ? <NotLoggedIn/> : <Favourites/>}/>
        <Route path='/my-uploads' element={!token ? <NotLoggedIn/> : <Myuploads/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/change-password' element={<ForgotPassword/>}/>

      </Routes>
      <Footer/>
    </>
  )
}

export default App
