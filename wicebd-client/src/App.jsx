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
import '../src/assets/css/moments.css'

import Routers from './Routers';
import IntroVideo from './components/others/IntroVideo';
import ScrollUpBtn from './components/others/ScrollUpBtn';
import { ToastContainer } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { useState } from 'react';

const SOUND_KEY = 'wicebd_intro_sound_played';

function App() {
  // Intro runs every load; sound only plays the very first time (localStorage flag)
  const [showIntro, setShowIntro] = useState(true);
  const withSound = !localStorage.getItem(SOUND_KEY);

  const handleIntroComplete = () => {
    if (withSound) localStorage.setItem(SOUND_KEY, '1');
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroVideo onComplete={handleIntroComplete} withSound={withSound} />}
      <div className='app-wrapper'>
        <Helmet>
          <title>WICEBD - </title>
          <link rel="shortcut icon" href="../images/favicon.ico"></link>
        </Helmet>
        <Routers />
        <ToastContainer />
        <ScrollUpBtn />
      </div>
    </>
  );
}

export default App