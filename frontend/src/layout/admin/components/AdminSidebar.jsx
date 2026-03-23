import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../../utils/JwtService';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout(navigate);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <>
            <style>{`
                .admin-sidebar {
                    width: 280px;
                    height: 100vh;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    left: 0;
                    top: 0;
                    padding: 0;
                    margin: 0;
                    overflow-y: auto;
                    box-shadow: 2px 0 15px rgba(0,0,0,0.2);
                    z-index: 1030;
                }

                .sidebar-header {
                    padding: 24px 16px;
                    border-bottom: 2px solid rgba(255,255,255,0.15);
                    background: rgba(0,0,0,0.1);
                    flex-shrink: 0;
                }

                .sidebar-header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .sidebar-header-icon {
                    width: 48px;
                    height: 48px;
                    background: rgba(255,255,255,0.25);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    flex-shrink: 0;
                }

                .sidebar-header-text h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                }

                .sidebar-header-text p {
                    margin: 4px 0 0 0;
                    font-size: 11px;
                    color: rgba(255,255,255,0.75);
                    font-weight: 500;
                    letter-spacing: 0.5px;
                }

                .sidebar-nav {
                    flex: 1;
                    padding: 12px 8px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    border-radius: 10px;
                    text-decoration: none;
                    color: rgba(255,255,255,0.85);
                    background: transparent;
                    border-left: 4px solid transparent;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.3px;
                    cursor: pointer;
                }

                .nav-link:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                    transform: translateX(4px);
                }

                .nav-link.active {
                    background: rgba(255,255,255,0.2);
                    color: #ffc107;
                    border-left-color: #ffc107;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    transform: translateX(4px);
                }

                .nav-link i {
                    font-size: 18px;
                    width: 24px;
                    text-align: center;
                    flex-shrink: 0;
                }

                .sidebar-footer {
                    padding: 12px 8px 16px 8px;
                    border-top: 2px solid rgba(255,255,255,0.15);
                    background: rgba(0,0,0,0.05);
                    flex-shrink: 0;
                    position: relative;
                }
                .admin-button {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px;
                    border-radius: 10px;
                    background: rgba(255,255,255,0.12);
                    border: 2px solid rgba(255,255,255,0.3);
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                }
                .admin-button:hover {
                    background: rgba(255,255,255,0.2);
                    border-color: rgba(255,255,255,0.5);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                }
                .admin-button-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .admin-button-icon {
                    font-size: 20px;
                }
                .admin-button-arrow {
                    font-size: 14px;
                    transition: transform 0.3s ease;
                }
                .admin-dropdown {
                    position: absolute;
                    bottom: calc(100% + 12px);
                    left: 8px;
                    right: 8px;
                    background: white;
                    color: #333;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    overflow: hidden;
                    z-index: 1100;
                    animation: slideUp 0.25s ease-out;
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 16px;
                    color: #dc3545;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                    font-size: 14px;
                }
                .dropdown-item:hover {
                    background: #ffe5e5;
                    padding-left: 20px;
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                /* Scrollbar styling */
                .sidebar-nav::-webkit-scrollbar {
                    width: 6px;
                }
                .sidebar-nav::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-nav::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 3px;
                }
                .sidebar-nav::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.4);
                }
                /* Main content margin adjustment */
                body {
                    margin-left: 0;
                }
            `}</style>

            <div className='admin-sidebar'>
                {/* ============ HEADER LOGO ============ */}
                <div className='sidebar-header'>
                    <div className='sidebar-header-content'>
                        <div className='sidebar-header-icon'>
                            <i className='fas fa-book-open'></i>
                        </div>
                        <div className='sidebar-header-text'>
                            <h3>NHÀ SÁCH</h3>
                            <p>ADMIN PANEL</p>
                        </div>
                    </div>
                </div>

                {/* ============ MENU ITEMS ============ */}
                <nav className='sidebar-nav'>
                    <NavLink to='/admin/books' className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        <i className='fas fa-book'></i>
                        <span>QUẢN LÝ SÁCH</span>
                    </NavLink>
                    <NavLink to='/admin/genres' className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        <i className='fas fa-layer-group'></i>
                        <span>QUẢN LÝ THỂ LOẠI</span>
                    </NavLink>
                    <NavLink to='/admin/users' className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        <i className='fas fa-users'></i>
                        <span>QUẢN LÝ TÀI KHOẢN</span>
                    </NavLink>
                    <NavLink to='/admin/orders' className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        <i className='fas fa-shopping-cart'></i>
                        <span>QUẢN LÝ ĐƠN HÀNG</span>
                    </NavLink>
                    <NavLink to='/admin/feedback' className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        <i className='fas fa-comments'></i>
                        <span>FEEDBACK</span>
                    </NavLink>
                    <NavLink to='/admin/coupon' className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
                        <i className='fas fa-ticket-alt'></i>
                        <span>MÃ GIẢM GIÁ</span>
                    </NavLink>
                </nav>

                {/* ============ ADMIN FOOTER ============ */}
                <div className='sidebar-footer' ref={dropdownRef}>
                    {showDropdown && (
                        <div className='admin-dropdown'>
                            <button
                                className='dropdown-item'
                                onClick={() => navigate('/')}
                            >
                                <i className='fas fa-home'></i>
                                <span>Về trang chủ</span>
                            </button>
                            <button
                                className='dropdown-item'
                                onClick={handleLogout}
                            >
                                <i className='fas fa-sign-out-alt'></i>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    )}

                    <button
                        className='admin-button'
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <div className='admin-button-content'>
                            <i className='admin-button-icon fas fa-user-circle'></i>
                            <span>ADMIN</span>
                        </div>
                        <i 
                            className='admin-button-arrow fas fa-chevron-down'
                            style={{ 
                                transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                        ></i>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;

