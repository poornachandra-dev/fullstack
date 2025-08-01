import img_1 from '../../assets/Not Login.svg'
import './NotLoggedIn.css'

const NotLoggedIn = () => {


  return (
    <section className='notsignin'>
        <img src={img_1} alt="" />
        <p><span>Your are not Logged in!</span> <br /> Please login to see the content.</p>
    </section>
  )
}

export default NotLoggedIn
