/* eslint-disable jsx-a11y/anchor-is-valid */
import { Avatar, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	getAvatarByToken,
	getLastNameByToken,
	getRoleByToken,
	isToken,
	logout,

} from "../utils/JwtService";

const Navbar = (props) => {
	const navigate = useNavigate();
    const location = useLocation();


return (
		<nav
			className='navbar navbar-expand-lg navbar-light bg-light sticky-top'
			style={{ zIndex: 2 }}
		>
			{/* <!-- Container wrapper --> */}
			<div className='container-fluid'>
				{/* <!-- Toggle button --> */}
				<button
					className='navbar-toggler'
					type='button'
					data-mdb-toggle='collapse'
					data-mdb-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<i className='fas fa-bars'></i>
				</button>
				{/* <!-- Collapsible wrapper --> */}
				<div
					className='collapse navbar-collapse'
					id='navbarSupportedContent'
				>
					{/* <!-- Navbar brand --> */}
					<Link className='navbar-brand mt-2 mt-lg-0' to='/'>
						<img
							src={"./../../../images/public/logo.png"}
							width='50'
							alt='MDB Logo'
							loading='lazy'
						/>
					</Link>
					{/* <!-- Left links --> */}
					<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/'>
								Trang chủ
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/about'>
								Giới thiệu
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/products'>
								Kho sách
							</NavLink>
						</li>

						<li className='nav-item'>
							<Link className='nav-link' to={"/policy"}>
								Chính sách
							</Link>
						</li>

						{isToken() && (
							<li className="nav-item">
								<NavLink className="nav-link" to="/feedback"> Feedback </NavLink>
							</li>
						)}

						{isToken() && (
							<li className="nav-item">
								<NavLink className="nav-link" to="/my-reviews"> Đánh giá sách </NavLink>
							</li>
						)}

					</ul>
					{/* <!-- Left links --> */}
				</div>
				{/* <!-- Collapsible wrapper --> */}
				{/* <!-- Right elements --> */}
				<div className='d-flex align-items-center'>
					{/* <!-- Shopping Cart --> */}
					<Link className='text-reset me-3' to='/cart'>
						<i className='fas fa-shopping-cart'></i>

					</Link>

						{!isToken() && (
						<div>
							<Link to={"/login"}>
								<Button>Đăng nhập</Button>
							</Link>
							<Link to={"/register"}>
								<Button>Đăng ký</Button>
							</Link>
						</div>
					)}

					{isToken() && (
						<>

							{/* <!-- Avatar --> */}
							<div className='dropdown'>
								<a
									className='dropdown-toggle d-flex align-items-center hidden-arrow'
									href='#'
									id='navbarDropdownMenuAvatar'
									role='button'
									data-mdb-toggle='dropdown'
									aria-expanded='false'
								>
									<Avatar
										style={{ fontSize: "14px" }}
										alt={getLastNameByToken()?.toUpperCase()}
										src={getAvatarByToken() || "/images/user/user-default.jpg"}
										sx={{ width: 30, height: 30 }}
									/>
								</a>
								<ul
									className='dropdown-menu dropdown-menu-end'
									aria-labelledby='navbarDropdownMenuAvatar'
								>
									<li>
										<Link to={"/profile"} className='dropdown-item'>
											Thông tin cá nhân
										</Link>
									</li>
									<li>
										<Link
											className='dropdown-item'
											to='/my-favorite-books'
										>
											Sách yêu thích của tôi
										</Link>
									</li>
									{getRoleByToken() === "ADMIN" && (
										<li>
											<Link
												className='dropdown-item'
												to='/admin/dashboard'
											>
												Quản lý
											</Link>
										</li>
									)}
									<li>
										<a
											className='dropdown-item'
											style={{ cursor: "pointer" }}
											onClick={() => {
												logout(navigate)
											}}
										>
											Đăng xuất
										</a>
									</li>
								</ul>
							</div>
						</>
					)}
					</div>
				{/* <!-- Right elements --> */}
			</div>
			{/* <!-- Container wrapper --> */}
		</nav>
	);
};

export default Navbar;
