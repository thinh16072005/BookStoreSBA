import React, { useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import CartItemModel from "../../model/CartItemModel";
import UserModel from "../../model/UserModel";
import { getIdUserByToken } from "../utils/JwtService";
import { get1User } from "../../api/UserApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, List, ListItem, ListItemButton, ListItemText, Radio, RadioGroup, TextField } from "@mui/material";
import { checkPhoneNumber } from "../utils/Validation";
import { BookHorizontal } from "./BookHorizontalProps";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import DeliveryModel from "../../model/DeliveryModel";
import { getDeliveryById } from "../../api/DeliveryApi";

import { getAllCoupons, getCoupon, updateUsedCoupon } from "../../api/CouponApi";

export const CheckoutPage = (props) => {
	useScrollToTop();


	// Xử lý phương thức thanh toán
	const [payment, setPayment] = useState(1); // mặc định là cod
	const [fullName, setFullName] = useState(""); //Họ và tên người nhận
	const [phoneNumber, setPhoneNumber] = useState(""); //Số điện thoại
	const [deliveryAddress, setDeliveryAddress] = useState(""); //Địa chỉ giao hàng
	const [note, setNote] = useState(""); //Ghi chú
	const [delivery, setDelivery] = useState(new DeliveryModel(1, "Giao hàng tận nơi", "Giao hàng tận nơi", 10000));
	const [couponList, setCouponList] = useState([]);
	const [selectedCoupon, setSelectedCoupon] = useState(null);
	const [showCouponDialog, setShowCouponDialog] = useState(false);


	// Báo lỗi
	const [errorPhoneNumber, setErrorPhoneNumber] = useState(""); //Lỗi số điện thoại


	// Lấy dữ liệu của người dùng
	const [user, setUser] = useState();
	useEffect(() => {

		getDeliveryById(1)
			.then((response) => {
				setDelivery(response);
			})
			.catch((error) => {
				console.log(error);
			});

		const idUser = Number(getIdUserByToken());
		get1User(idUser)
			.then((response) => {
				setUser(response);
				setFullName(response.firstName + " " + response.lastName);
				setPhoneNumber(response.phoneNumber);
				setDeliveryAddress(response.deliveryAddress);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	//Lấy mã giảm giá
	useEffect(() => {
		getAllCoupons()
			.then((response) => {
				setCouponList(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	//Hàm xử lý khi người dùng thay đổi phương thức thanh toán
	const handleChangePayment = (event) => {
		setPayment(Number(event.target.value));
	};

	//Hàm xử lý submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		//Xóa tất cả các thông báo lỗi
		setErrorPhoneNumber("");

		//Lấy token
		const token = localStorage.getItem("token");

		const orderItems = [];

		props.cartList.forEach((cartItem) => {
			orderItems.push({
				idBook: cartItem.book?.idBook,
				quantity: cartItem.quantity,
			})
		})

		if (payment === 2) {
			try {

				if (selectedCoupon) {
					await updateUsedCoupon(selectedCoupon.code);
				}

				// Lưu thông tin đơn hàng vào localStorage trước khi redirect
				const orderData = {
					deliveryAddress: deliveryAddress,
					phoneNumber: phoneNumber,
					fullName: fullName,
					totalPriceProduct: props.totalPriceProduct,
					note: note,
					idPayment: payment,
					idUser: Number(getIdUserByToken()),
					orderItems: orderItems,
					totalPrice: (props.totalPriceProduct  * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery),
					paymentStatus: "PAID" // PayOS - đã thanh toán
				};
				localStorage.setItem('pendingOrder', JSON.stringify(orderData));

				const paymentRequest = {
					productName: "Đơn hàng sách",
					description: "Thanh toán đơn hàng",
					amount: (props.totalPriceProduct  * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery),
					returnUrl: "http://localhost:3000/payment-success",
					cancelUrl: "http://localhost:3000/cart"
				};

				const response = await fetch("http://localhost:8080/payment/create-payment-link", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${localStorage.getItem("token")}`
					},
					body: JSON.stringify(paymentRequest)
				});

				if (response.ok) {
					const result = await response.json();
					if (result.error === 0) {

						// Redirect đến trang thanh toán PayOS
						window.location.href = result.data.checkoutUrl;
					} else {
						toast.error(result.message); // Nếu error === 1 thì sẽ hiển thị message
					}
				} else {
					toast.error("Không thể tạo link thanh toán");
				}
			} catch (error) {
				console.error("Payment error:", error);
				toast.error("Lỗi thanh toán");
			}
		}

		//Nếu người dùng chọn phương thức thanh toán là COD
		if (payment === 1) {

			const request = {
				deliveryAddress: deliveryAddress,
				phoneNumber: phoneNumber,
				fullName: fullName,
				totalPriceProduct: props.totalPriceProduct,
				note: note,
				idPayment: payment,
				idUser: Number(getIdUserByToken()),
				orderItems: orderItems,
				totalPrice: (props.totalPriceProduct  * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery),
				paymentStatus: "PENDING"
			}

			try {
				const endPoint = endpointBE + "/order/add-order";
				const response = await fetch(endPoint, {
					method: "POST",
					headers: {
						"Authorization": "Bearer " + token,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(request)
				});

				if (response.ok) {
					toast.success("Đặt hàng thành công!");
					props.setIsCheckout(false);
					if (props.onSuccessSubmit) {
						props.onSuccessSubmit();
					}
					if (selectedCoupon) {
						await updateUsedCoupon(selectedCoupon.code);
					}
				}
				else {
					toast.error((await response.json()).message);
				}
			} catch (error) {
				toast.error("Đặt hàng thất bại!");
			}
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>ĐỊA CHỈ GIAO HÀNG</strong>
					<hr />
					<div className='row'>
						<div className='col-lg-6 col-md-6 col-sm-12'>
							<TextField
								required={true}
								fullWidth
								type='text'
								label='Họ và tên người nhận'
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className='input-field'
							/>
							<TextField
								error={errorPhoneNumber.length > 0 ? true : false}
								helperText={errorPhoneNumber}
								required={true}
								fullWidth
								type='text'
								label='Số điện thoại'
								value={phoneNumber}
								onChange={(e) => { setPhoneNumber(e.target.value); checkPhoneNumber(setErrorPhoneNumber, e.target.value) }}
								className='input-field'
							/>
						</div>
						<div className='col-lg-6 col-md-6 col-sm-12'>
							<TextField
								required={true}
								fullWidth
								type='text'
								label='Email'
								value={user?.email}
								disabled
								className='input-field'
							/>
							<TextField
								required={true}
								fullWidth
								type='text'
								label='Địa chỉ nhận hàng'
								value={deliveryAddress}
								onChange={(e) => setDeliveryAddress(e.target.value)}
								className='input-field'
							/>
						</div>
					</div>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>PHƯƠNG THỨC THANH TOÁN</strong>
					<hr />
					<FormControl>
						<RadioGroup
							aria-labelledby='demo-controlled-radio-buttons-group'
							name='controlled-radio-buttons-group'
							value={payment}
							onChange={handleChangePayment}
						>
							<FormControlLabel
								value={1}
								control={<Radio />}
								label={
									<div
										style={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<img
											src='https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_cashondelivery.svg?q=10311'
											alt='Cash on Delivery'
											style={{
												width: "40px",
												marginRight: "10px",
											}}
										/>
										Thanh toán tiền mặt khi nhận hàng (COD)
									</div>
								}
							/>

							<FormControlLabel
								value={2}
								control={<Radio />}
								label={
									<div
										style={{
											display: "flex",
											alignItems: "center",
										}}
									>
										<img
											src='https://payos.vn/docs/img/logo.svg'
											alt='Cash on Delivery'
											style={{
												width: "55px",
											}}
										/>
										Thanh toán bằng PAYOS
									</div>
								}
							/>
						</RadioGroup>
					</FormControl>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>MÃ KHUYẾN MÃI GIẢM GIÁ</strong>
					<hr />
					<div className='d-flex align-items-end w-50'>
						<TextField
							className='w-50'
							id='standard-basic'
							label='Mã khuyến mãi (nếu có): '
							variant='standard'
							value={selectedCoupon?.code || ""}
							InputProps={{ readOnly: true }}
						/>
						<Button
							className='ms-3'
							variant='outlined'
							onClick={() => setShowCouponDialog(true)}
						>
							Lấy mã giảm giá
						</Button>
					</div>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>GHI CHÚ</strong>
					<hr />
					<TextField
						className='w-100'
						id='standard-basic'
						label='Ghi chú'
						variant='outlined'
						multiline
						minRows={3}
						maxRows={4}
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'>
					<strong className='fs-6'>KIỂM TRA LẠI ĐƠN HÀNG</strong>
					<hr />
					<div className='row my-3'>
						<div className='col'>
							<span className='ms-3'>Sản phẩm</span>
						</div>
						<div className='col-2 text-center'>Số lượng</div>
						<div className='col-2 text-center'>Tổng tiền</div>
					</div>

					{props.cartList.map((cartItem) => {
						return (
							<BookHorizontal
								cartItem={cartItem}
								key={cartItem.idCart}
							/>
						);
					})}
				</div>
				<div className='container bg-light my-3 rounded-3 p-3'
					style={{ height: "auto" }}
				>
					<div className='container my-3'>
						<div className='row'>
							<div className='me-3 col text-end'>Tổng số tiền sách</div>
							<div className='ms-3 col-2 text-end'>
								{props.totalPriceProduct.toLocaleString("vi-vn")} đ
							</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>Mã giảm giá</div>
							<div className='ms-3 col-2 text-end'>{selectedCoupon?.discountPercent}%</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>--------------</div>
							<div className='ms-3 col-2 text-end'>--------</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>Phí vận chuyển</div>
							<div className='ms-3 col-2 text-end'>{delivery.feeDelivery.toLocaleString("vi-vn")} đ</div>
						</div>
						<div className='row'>
							<div className='me-3 col text-end'>
								<strong>Tổng số tiền (gồm VAT)</strong>
							</div>
							<div className='ms-3 col-2 text-end text-danger fs-5'>
								<strong>
									{(props.totalPriceProduct * (1 - (selectedCoupon?.discountPercent || 0) / 100) + delivery.feeDelivery).toLocaleString("vi-vn")}{" "}
									đ
								</strong>
							</div>
						</div>
						<hr className='mt-3' />
						<div className='row' style={{ marginTop: '10px' }}>
							<div className='col-6 d-flex align-items-center'>
								<span
									style={{ cursor: "pointer" }}
									onClick={() => props.setIsCheckout(false)}
								>
									<strong className='ms-2'>Quay trở về</strong>
								</span>
							</div>
							<div className='col-6'>
								<Button
									type='submit'
									variant='contained'
									sx={{ width: "100%" }}
								>
									Xác nhận thanh toán
								</Button>
							</div>
						</div>
					</div>
				</div>
			</form>

			<Dialog open={showCouponDialog} onClose={() => setShowCouponDialog(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Chọn mã giảm giá</DialogTitle>
				<DialogContent>
					<List>
						{couponList.length === 0 && (
							<ListItem>
								<ListItemText primary="Không có mã giảm giá khả dụng!" />
							</ListItem>
						)}
						{couponList
							.filter(coupon => coupon.isUsed === false && coupon.isActive === true && new Date(coupon.expiryDate).getTime() > new Date().getTime())
							.map((coupon) => (
								<ListItemButton
									key={coupon.idCoupon}
									onClick={() => {
										setSelectedCoupon(coupon);
										setShowCouponDialog(false);
										toast.success(`Đã chọn mã: ${coupon.code}`);
									}}
								>
									<ListItemText
										primary={coupon.code}
										secondary={`Giảm ${coupon.discountPercent}% - HSD: ${new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}`}
									/>
								</ListItemButton>
							))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowCouponDialog(false)}>
						Đóng
					</Button>
				</DialogActions>
			</Dialog>

		</>
	);
};
