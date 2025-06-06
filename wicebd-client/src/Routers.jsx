import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
import Login from './pages/innerPages/Login';
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
                <Route path='/buy-ticket' element={<BuyTicket />}></Route>
                <Route path='/blog-sidebar' element={<BlogSidebar />}></Route>
                <Route path='/blog-grid' element={<BlogGrid />}></Route>
                <Route path='/blog-single/:id' element={<BlogSingle />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/contact' element={<Contact />}></Route>
                <Route path='/callback' element={<PaymentCallback />}></Route>
                <Route path='/thank-you' element={<ThankYou />}></Route>
                <Route path="/payment-error" element={<PaymentError />} />
                <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                <Route path="/olympiad" element={<Olympiad />} />
                {/*Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
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