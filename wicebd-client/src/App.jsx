import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import 'react-toastify/dist/ReactToastify.css'
import 'react-modal-video/css/modal-video.css'
import 'photoswipe/dist/photoswipe.css'

import '../src/assets/css/color-switcher-design.css'
import '../src/assets/css/flaticon.css'
import '../src/assets/css/elegent-icon.css'
import '../src/assets/css/fontawesome-all.css'
import '../src/assets/css/animate.css'
import '../src/assets/css/style.css'
import '../src/assets/css/responsive.css'

import Routers from './Routers';
import Preloader from './components/others/Preloader';
import ScrollUpBtn from './components/others/ScrollUpBtn';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';

function App() {

  //  Preloader 
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1200)
  }, [])

  return (
    <>
      {isLoading ? <Preloader /> :
        <div className='app-wrapper'>
          <Helmet>
            <title>WICEBD - Digital Events React Template</title>
            <link rel="shortcut icon" href="../images/favicon.ico"></link>
          </Helmet>
          <Routers />
          <ToastContainer />
          <ScrollUpBtn />
        </div>
      }
    </>
  )
}

export default App