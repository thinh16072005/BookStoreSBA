import React from "react";
import { Link } from "react-router-dom";

function Footer() {

	return (
		// <!-- Footer -->
		<footer className='bg-primary text-center text-white'>
			{/* <!-- Grid container --> */}
			<div className='container p-4'>
				{/* <!-- Section: Social media --> */}
				<section className='mb-4'>
					{/* <!-- Facebook --> */}
					<a
						className='btn btn-outline-light btn-floating m-1'
						href='#!'
						role='button'
					>
						<i className='fab fa-facebook-f'></i>
					</a>

					{/* <!-- Twitter --> */}
					<a
						className='btn btn-outline-light btn-floating m-1'
						href='#!'
						role='button'
					>
						<i className='fab fa-twitter'></i>
					</a>

					{/* <!-- Google --> */}
					<a
						className='btn btn-outline-light btn-floating m-1'
						href='#!'
						role='button'
					>
						<i className='fab fa-google'></i>
					</a>

					{/* <!-- Instagram --> */}
					<a
						className='btn btn-outline-light btn-floating m-1'
						href='#!'
						role='button'
					>
						<i className='fab fa-instagram'></i>
					</a>

					{/* <!-- Linkedin --> */}
					<a
						className='btn btn-outline-light btn-floating m-1'
						href='#!'
						role='button'
					>
						<i className='fab fa-linkedin-in'></i>
					</a>

					{/* <!-- Github --> */}
					<a
						className='btn btn-outline-light btn-floating m-1'
						href='#!'
						role='button'
					>
						<i className='fab fa-github'></i>
					</a>
				</section>
				{/* <!-- Section: Social media --> */}

				{/* <!-- Section: Form --> */}
				<section className=''>
					<form action=''>
						{/* <!--Grid row--> */}
						<div className='row d-flex justify-content-center'>
							<div className='col-auto'>
								<p className='pt-2'>
									<strong>Đăng ký nhận bản tin</strong>
								</p>
							</div>

							<div className='col-md-5 col-12'>
								{/* <!-- Email input --> */}
								<div className=' form-white mb-4'>
									<input
										type='email'
										id='form5Example21'
										className='form-control'
										placeholder='Nhập Email'
									/>
								</div>
							</div>

							<div className='col-auto'>
								{/* <!-- Submit button --> */}
								<button
									type='button'
									className='btn btn-outline-light mb-4'
								>
									Đăng ký
								</button>
							</div>
						</div>
						{/* <!--Grid row--> */}
					</form>
				</section>
				{/* <!-- Section: Form --> */}

				{/* <!-- Section: Links --> */}
				<section className=''>
					{/* <!--Grid row--> */}
					<div className='row'>
						<div className='col-lg-6 col-md-12'>
							<div className='row'>
								<div className='col-lg-4 col-md-12 mb-4'>
									<h5 className='text-uppercase'>DỊCH VỤ</h5>

									<ul className='list-unstyled mb-0'>
										<li>
											<a href='#!' className='text-white'>
												Điều khoản sử dụng
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Chính sách bảo mật thông tin cá nhân
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Chính sách bảo mật thanh toán
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Hệ thống trung tâm - nhà sách
											</a>
										</li>
									</ul>
								</div>

								<div className='col-lg-4 col-md-12 mb-4'>
									<h5 className='text-uppercase'>HỖ TRỢ</h5>

									<ul className='list-unstyled mb-0'>
										<li>
											<a href='#!' className='text-white'>
												Chính sách đổi - trả - hoàn tiền
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Chính sách bảo hành - bồi hoàn
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Chính sách vận chuyển
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Chính sách khách sỉ
											</a>
										</li>
									</ul>
								</div>

								<div className='col-lg-4 col-md-12 mb-4'>
									<h5 className='text-uppercase'>TÀI KHOẢN CỦA TÔI</h5>

									<ul className='list-unstyled mb-0'>
										<li>
											<Link to={"/login"} className='text-white'>
												Đăng nhập/Tạo mới tài khoản
											</Link>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Thay đổi địa chỉ khách hàng
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Chi tiết tài khoản
											</a>
										</li>
										<li>
											<a href='#!' className='text-white'>
												Lịch sử mua hàng
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className='col-lg-6 col-md-12'>
							<iframe
								title='map'
								src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.6737349979257!2d108.25950117490213!3d15.978405784688055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314210f2d038af0f%3A0x51c64b1130497f99!2sFPT%20Software%20Danang!5e0!3m2!1svi!2s!4v1761706184642!5m2!1svi!2s'
								width='500'
								height='200'
								style={{ border: 0 }}
								loading='lazy'
								referrerPolicy='no-referrer-when-downgrade'
							></iframe>
						</div>
					</div>
					{/* <!--Grid row--> */}
				</section>
				{/* <!-- Section: Links --> */}
			</div>
			{/* <!-- Grid container --> */}

			{/* <!-- Copyright --> */}
			<div
				className='text-center p-3'
				style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
			>
				© 2023 Copyright
				<span className='text-white text-decoration-underline'>
					{" "}
					bookstore
				</span>
			</div>
			{/* <!-- Copyright --> */}
		</footer>
	);
}

export default Footer;
