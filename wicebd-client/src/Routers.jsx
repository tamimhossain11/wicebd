import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminRoute from './components/admin/AdminRoute';
import UserRoute  from './components/user/UserRoute';
import JudgeRoute from './components/judge/JudgeRoute';

/* ── After a deploy, old chunk hashes 404. Reload once to pick up the new index.html. ── */
const lazyWithReload = (importFn) =>
  lazy(() =>
    importFn().catch((err) => {
      const reloadKey = 'chunk_reload_attempted';
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
      }
      throw err;
    })
  );

/* ── Lazy-load every page so Vite splits each into its own chunk ── */
const Home2              = lazyWithReload(() => import('./pages/homePages/Home2'));
const AboutUs            = lazyWithReload(() => import('./pages/innerPages/AboutUs'));
const Pricing            = lazyWithReload(() => import('./pages/innerPages/Pricing'));
const Faq                = lazyWithReload(() => import('./pages/innerPages/Faq'));
const Gallery            = lazyWithReload(() => import('./pages/innerPages/Gallery'));
const ComingSoon         = lazyWithReload(() => import('./pages/innerPages/ComingSoon'));
const Speakers           = lazyWithReload(() => import('./pages/innerPages/Speakers'));
const SpeakersDetail     = lazyWithReload(() => import('./pages/innerPages/SpeakersDetail'));
const Schedule           = lazyWithReload(() => import('./pages/innerPages/Schedule'));
const EventDetails       = lazyWithReload(() => import('./pages/innerPages/EventDetails'));
const BlogSidebar        = lazyWithReload(() => import('./pages/innerPages/BlogSidebar'));
const BlogGrid           = lazyWithReload(() => import('./pages/innerPages/BlogGrid'));
const BlogSingle         = lazyWithReload(() => import('./pages/innerPages/BlogSingle'));
const Contact            = lazyWithReload(() => import('./pages/innerPages/Contact'));
const ErrorPage          = lazyWithReload(() => import('./pages/innerPages/ErrorPage'));
const PaymentCallback    = lazyWithReload(() => import('./pages/callback/PaymentCallback'));
const CheckoutPage       = lazyWithReload(() => import('./pages/checkout/CheckoutPage'));
const ThankYou           = lazyWithReload(() => import('./pages/callback/PaymentSuccess'));
const PaymentError       = lazyWithReload(() => import('./pages/callback/PaymentError'));
const PaymentCancelled   = lazyWithReload(() => import('./pages/callback/PaymentCancelled'));
const AdminDashboard     = lazyWithReload(() => import('./pages/admin/AdminDashboard'));
const QrCode             = lazyWithReload(() => import('./pages/admin/QrCode'));
const SelectedTeams      = lazyWithReload(() => import('./pages/innerPages/SelectedTeams'));
const Announcements      = lazyWithReload(() => import('./pages/innerPages/Announcements'));
const BlogDetails        = lazyWithReload(() => import('./pages/innerPages/BlogDetails'));
const InternationalTeam  = lazyWithReload(() => import('./pages/innerPages/InternationalTeam'));
const OrganizingPanel    = lazyWithReload(() => import('./pages/innerPages/OrganizingPanel'));
const RegistrationPage   = lazyWithReload(() => import('./pages/innerPages/RegistrationPage'));
const Partners           = lazyWithReload(() => import('./pages/innerPages/Partners'));
const SignIn             = lazyWithReload(() => import('./pages/userAuth/SignIn'));
const SignUp             = lazyWithReload(() => import('./pages/userAuth/SignUp'));
const UserProfile        = lazyWithReload(() => import('./pages/userAuth/UserProfile'));
const UserDashboard      = lazyWithReload(() => import('./pages/userDashboard/UserDashboard'));
const SurpriseSegment    = lazyWithReload(() => import('./pages/innerPages/SurpriseSegment'));
const OlympiadExamPortal = lazyWithReload(() => import('./pages/userDashboard/OlympiadExamPortal'));
const PrivacyPolicy      = lazyWithReload(() => import('./pages/innerPages/PrivacyPolicy'));
const JudgeDashboard     = lazyWithReload(() => import('./pages/judge/JudgeDashboard'));
const TermsAndConditions = lazyWithReload(() => import('./pages/innerPages/TermsAndConditions'));
const ReturnRefundPolicy = lazyWithReload(() => import('./pages/innerPages/ReturnRefundPolicy'));
const DeliveryPolicy     = lazyWithReload(() => import('./pages/innerPages/DeliveryPolicy'));

/* ── Minimal spinner shown while a lazy chunk is downloading ── */
const PageLoader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0d0006',
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid rgba(128,0,32,0.2)',
      borderTopColor: '#800020',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const Routers = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path='/'            element={<Home2 />} />
      <Route path='/about-us'    element={<AboutUs />} />
      <Route path='/pricing'     element={<Pricing />} />
      <Route path='/faqs'        element={<Faq />} />
      <Route path='/gallery'     element={<Gallery />} />
      <Route path='/coming-soon' element={<ComingSoon />} />
      <Route path='/speakers'    element={<Speakers />} />
      <Route path='/speakers-detail/:id' element={<SpeakersDetail />} />
      <Route path='/schedule'    element={<Schedule />} />
      <Route path='/event-detail/:parentId/:childId' element={<EventDetails />} />
      <Route path='/buy-ticket'  element={<Navigate to="/registration" replace />} />
      <Route path='/registration' element={<UserRoute><RegistrationPage /></UserRoute>} />
      <Route path='/selected-teams'     element={<SelectedTeams />} />
      <Route path='/announcements'      element={<Announcements />} />
      <Route path='/blog-details'       element={<BlogDetails />} />
      <Route path='/international-team' element={<InternationalTeam />} />
      <Route path='/organizing-panel'   element={<OrganizingPanel />} />
      <Route path='/blog-sidebar'       element={<BlogSidebar />} />
      <Route path='/blog-grid'          element={<BlogGrid />} />
      <Route path='/blog-single/:id'    element={<BlogSingle />} />
      <Route path='/login'    element={<Navigate to="/sign-in" replace />} />
      <Route path='/sign-in'  element={<SignIn />} />
      <Route path='/sign-up'  element={<SignUp />} />
      <Route path='/dashboard' element={<UserRoute><UserDashboard /></UserRoute>} />
      <Route path='/profile'   element={<UserRoute><UserProfile /></UserRoute>} />
      <Route path='/surprise-segment' element={<SurpriseSegment />} />
      <Route path='/partners'         element={<Partners />} />
      <Route path='/contact'          element={<Contact />} />
      <Route path='/privacy-policy'        element={<PrivacyPolicy />} />
      <Route path='/terms-and-conditions'  element={<TermsAndConditions />} />
      <Route path='/return-refund-policy'  element={<ReturnRefundPolicy />} />
      <Route path='/delivery-policy'       element={<DeliveryPolicy />} />
      <Route path='/checkout'          element={<CheckoutPage />} />
      <Route path='/callback'          element={<PaymentCallback />} />
      <Route path='/thank-you'         element={<ThankYou />} />
      <Route path='/payment-error'     element={<PaymentError />} />
      <Route path='/payment-cancelled' element={<PaymentCancelled />} />
      <Route path='/olympiad'      element={<Navigate to="/sign-in" replace />} />
      <Route path='/olympiad-exam' element={<UserRoute><OlympiadExamPortal /></UserRoute>} />
      <Route path='/admin/login'   element={<Navigate to="/sign-in" replace />} />
      <Route path='/admin/dashboard' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path='/admin/qr-code'   element={<AdminRoute><QrCode /></AdminRoute>} />
      <Route path='/judge/login'     element={<Navigate to="/sign-in" replace />} />
      <Route path='/judge/dashboard' element={<JudgeRoute><JudgeDashboard /></JudgeRoute>} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  </Suspense>
);

export default Routers;
