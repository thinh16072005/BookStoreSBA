import React, { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './layout/pages/HomePage';
import { Error404Page } from './layout/pages/errorpage/404Page';
import { Error403Page } from './layout/pages/errorpage/403Page';
import Navbar from './layout/header-footer/Navbar';
import Footer from './layout/header-footer/Footer';
import PolicyPage from './layout/pages/PolicyPage';
import About from './layout/about/About';
import FilterableBookList from './layout/products/FilterableBookList';
import RegisterPage from './layout/user/RegisterPage';
import ActiveAccount from './layout/user/ActiveAccount';
import LoginPage from './layout/user/LoginPage';
import ProfilePage from './layout/user/ProfilePage';
import {ForgotPassword} from "./layout/user/ForgotPassword";
import {FeedbackCustomerPage} from "./layout/pages/feedback/FeedbackCustomerPage";
import MyFavoriteBooksPage from "./layout/pages/MyFavoriteBooksPage.jsx";

const MyRoutes = () => {

    const [reloadAvatar, setReloadAvatar] = useState(0);
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPath && <Navbar key={reloadAvatar} />}

            <Routes>
                {/* Customer Routes */}
                <Route path='/' element={<HomePage />} />
                <Route path='/error-403' element={<Error403Page />} />
                <Route path='/error-404' element={<Error404Page />} />
                <Route path='/policy' element={<PolicyPage />} />
                <Route path='/about' element={<About />} />
                <Route path='/products' element={<FilterableBookList />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/active/:email/:activationCode' element={<ActiveAccount />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/my-favorite-books' element={<MyFavoriteBooksPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path="/feedback" element={<FeedbackCustomerPage />} />

                {!isAdminPath && (
                    <Route path='*' element={<Error404Page />} />
                )}
            </Routes>

            {!isAdminPath && <Footer />}

        </>
    );
};


function App() {
    return (
        <div className="App">
            <MyRoutes />
            <ToastContainer
                position='bottom-center'
                autoClose={3000}
                pauseOnFocusLoss={false}
            />
        </div>
    );
}

export default App;
