import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from './components/others/ScrollToTop.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext.jsx'
import { JudgeAuthProvider } from './context/JudgeAuthContext.jsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const FACEBOOK_APP_ID  = import.meta.env.VITE_FACEBOOK_APP_ID  || '';

// Load Facebook JS SDK
window._fbReady = false;
window.fbAsyncInit = function () {
  window.FB.init({
    appId: FACEBOOK_APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v19.0',
  });
  window._fbReady = true;
};
(function (d, s, id) {
  if (d.getElementById(id)) return;
  const js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  d.getElementsByTagName('head')[0].appendChild(js);
})(document, 'script', 'facebook-jssdk');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <JudgeAuthProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <App />
            <ScrollToTop />
          </BrowserRouter>
        </JudgeAuthProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
