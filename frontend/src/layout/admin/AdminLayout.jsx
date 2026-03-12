import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../../../../SampleSBA/BookStoreProject/frontend/src/layout/admin/components/AdminSidebar.jsx';
import NotificationBell from '../../../../../SampleSBA/BookStoreProject/frontend/src/layout/admin/components/NotificationBell.jsx';

const AdminLayout = () => {
    return (
        <>
            <style>{`
                .admin-layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    margin-left: 280px;
                }

                .admin-header {
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    padding: 16px 24px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .admin-content {
                    flex: 1;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    padding: 24px;
                    overflow-y: auto;
                }

                .admin-content-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                @media (max-width: 1024px) {
                    .admin-layout {
                        margin-left: 0;
                    }

                    .admin-sidebar {
                        width: 240px !important;
                    }
                }
            `}</style>

            <AdminSidebar />

            <div className='admin-layout'>
                <div className='admin-header'>
                    <NotificationBell />
                </div>
                <div className='admin-content'>
                    <div className='admin-content-inner'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
