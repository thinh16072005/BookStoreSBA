import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import HomePage from './layout/pages/HomePage';

const MyRoutes = () => {

    return (
        <>

            <Routes>
                {/* Customer Routes */}
                <Route path='/' element={<HomePage />} />

            </Routes>

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
