import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home2 from './pages/homePages/Home2';
import AboutUs from './pages/innerPages/AboutUs';
import Pricing from './pages/innerPages/Pricing';
import Faq from './pages/innerPages/Faq';
import Gallery from './pages/innerPages/Gallery';
import ComingSoon from './pages/innerPages/ComingSoon';
import Speakers from './pages/innerPages/Speakers';
import SpeakersDetail from './pages/innerPages/SpeakersDetail';
import Schedule from './pages/innerPages/Schedule';
import EventDetails from './pages/innerPages/EventDetails';
import BuyTicket from './pages/innerPages/BuyTicket';
import BlogSidebar from './pages/innerPages/BlogSidebar';
import BlogGrid from './pages/innerPages/BlogGrid';
import BlogSingle from './pages/innerPages/BlogSingle';
import Contact from './pages/innerPages/Contact';
import ErrorPage from './pages/innerPages/ErrorPage';
import PaymentCallback from './pages/callback/PaymentCallback';
import ThankYou from './pages/callback/PaymentSuccess';
import PaymentError from './pages/callback/PaymentError';
import PaymentCancelled from './pages/callback/PaymentCancelled';
import AdminRoute from './components/admin/AdminRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import Olympiad from './pages/innerPages/Olympiad';
import QrCode from './pages/admin/QrCode'
import SelectedTeams from './pages/innerPages/SelectedTeams';
import Announcements from './pages/innerPages/Announcements';
import BlogDetails from './pages/innerPages/BlogDetails';
import InternationalTeam from './pages/innerPages/InternationalTeam';
import OrganizingPanel from './pages/innerPages/OrganizingPanel';
import RegistrationPage from './pages/innerPages/RegistrationPage';
import Partners from './pages/innerPages/Partners';
import SignIn from './pages/userAuth/SignIn';
import SignUp from './pages/userAuth/SignUp';
import UserProfile from './pages/userAuth/UserProfile';
import UserDashboard from './pages/userDashboard/UserDashboard';
import SurpriseSegment from './pages/innerPages/SurpriseSegment';
import UserRoute from './components/user/UserRoute';
import OlympiadExamPortal from './pages/userDashboard/OlympiadExamPortal';
import PrivacyPolicy from './pages/innerPages/PrivacyPolicy';
import TermsAndConditions from './pages/innerPages/TermsAndConditions';
import ReturnRefundPolicy from './pages/innerPages/ReturnRefundPolicy';
import DeliveryPolicy from './pages/innerPages/DeliveryPolicy';


const Routers = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home2 />}></Route>
                <Route path='/about-us' element={<AboutUs />}></Route>
                <Route path='/pricing' element={<Pricing />}></Route>
                <Route path='/faqs' element={<Faq />}></Route>
                <Route path='/gallery' element={<Gallery />}></Route>
                <Route path='/coming-soon' element={<ComingSoon />}></Route>
                <Route path='/speakers' element={<Speakers />}></Route>
                <Route path='/speakers-detail/:id' element={<SpeakersDetail />}></Route>
                <Route path='/schedule' element={<Schedule />}></Route>
                <Route path='/event-detail/:parentId/:childId' element={<EventDetails />}></Route>
                <Route path='/buy-ticket' element={<Navigate to="/registration" replace />} />
                <Route
                  path='/registration'
                  element={
                    <UserRoute>
                      <RegistrationPage />
                    </UserRoute>
                  }
                />
                <Route path='/selected-teams' element={<SelectedTeams />}></Route>
                <Route path='/announcements' element={<Announcements />}></Route>
                <Route path='/blog-details' element={<BlogDetails />}></Route>
                <Route path='/international-team' element={<InternationalTeam />}></Route>
                <Route path='/organizing-panel' element={<OrganizingPanel />}></Route>
                <Route path='/blog-sidebar' element={<BlogSidebar />}></Route>
                <Route path='/blog-grid' element={<BlogGrid />}></Route>
                <Route path='/blog-single/:id' element={<BlogSingle />}></Route>
                <Route path='/login' element={<Navigate to="/sign-in" replace />} />
                {/* User Auth & Dashboard */}
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route
                  path='/dashboard'
                  element={
                    <UserRoute>
                      <UserDashboard />
                    </UserRoute>
                  }
                />
                <Route
                  path='/profile'
                  element={
                    <UserRoute>
                      <UserProfile />
                    </UserRoute>
                  }
                />
                <Route path='/surprise-segment' element={<SurpriseSegment />} />
                <Route path='/partners' element={<Partners />} />
                <Route path='/contact' element={<Contact />}></Route>
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
                <Route path='/return-refund-policy' element={<ReturnRefundPolicy />} />
                <Route path='/delivery-policy' element={<DeliveryPolicy />} />
                <Route path='/callback' element={<PaymentCallback />}></Route>
                <Route path='/thank-you' element={<ThankYou />}></Route>
                <Route path="/payment-error" element={<PaymentError />} />
                <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                <Route path="/olympiad" element={<Navigate to="/sign-in" replace />} />
                <Route
                  path='/olympiad-exam'
                  element={
                    <UserRoute>
                      <OlympiadExamPortal />
                    </UserRoute>
                  }
                />
                {/*Admin Routes */}
                <Route path="/admin/login" element={<Navigate to="/sign-in" replace />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminRoute>
                            <AdminDashboard />

                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/qr-code"
                    element={
                        <AdminRoute>
                            <QrCode />
                        </AdminRoute>
                    }
                />

                <Route path='*' element={<ErrorPage />}></Route>
            </Routes>
        </>
    );
};

export default Routers;