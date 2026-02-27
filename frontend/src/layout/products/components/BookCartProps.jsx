import { Skeleton, Tooltip } from "@mui/material";
import CartItemModel from "../../../model/CartItemModel"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageModel from "../../../model/ImageModel";
import { getAllImageByBook } from "../../../api/ImageApi";
import SelectQuantity from "./select-quantity/SelectQuantity";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";
import { toast } from "react-toastify";
import { updateQuantityCartItem } from "../../../api/CartApi";

const BookCartProps = (props) => {


	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);

	// State để quản lý số lượng sản phẩm
	const [quantity, setQuantity] = useState(props.cartItem.quantity || 1);

	// Lấy ra hình ảnh của sách
	const [images, setImages] = useState(null);
	useEffect(() => {
		if (props.cartItem.book) {
			// Lấy ra hình ảnh của sách
			getAllImageByBook(props.cartItem.book.idBook)
				.then((response) => {
					setImages(response);
				})
				.catch((error) => {
					setErroring(error);
					console.error(error);
				});
		}

		setLoading(false);
	}, []);

	// Cập nhật quantity khi cartItem thay đổi
	useEffect(() => {
		setQuantity(props.cartItem.quantity || 1);
	}, [props.cartItem.quantity]);

	// Xử lý tăng số lượng
	const handleIncrease = () => {
		if (props.cartItem.book && quantity < (props.cartItem.book?.quantity || 0)) {
			const newQuantity = quantity + 1;
			setQuantity(newQuantity); //Cập nhật số lượng mới

			// Tạo cartItem mới với quantity mới
			const updatedCartItem = new CartItemModel(
				props.cartItem.idCart,
				newQuantity,
				props.cartItem.book,
				props.cartItem.idUser
			);

			// Gọi API cập nhật
			updateQuantityCartItem(updatedCartItem)
				.then(() => {
					// Gọi callback để reload giỏ hàng
					props.onDeleteSuccess();
				})
				.catch((error) => {
					console.error("Lỗi cập nhật số lượng:", error);

					setQuantity(quantity); //Set lại số lượng cũ
					toast.error("Không thể cập nhật số lượng");
				});
		} else {
			toast.warning("Số lượng sản phẩm đã đạt tối đa");
		}
	};

	// Xử lý giảm số lượng
	const handleDecrease = () => {
		if (quantity > 1) {
			const newQuantity = quantity - 1;
			setQuantity(newQuantity);

			// Tạo cartItem mới với quantity mới
			const updatedCartItem = new CartItemModel(
				props.cartItem.idCart,
				newQuantity,
				props.cartItem.book,
				props.cartItem.idUser
			);

			// Gọi API cập nhật
			updateQuantityCartItem(updatedCartItem)
				.then(() => {
					// Gọi callback để reload giỏ hàng
					props.onDeleteSuccess();
				})
				.catch((error) => {
					console.error("Lỗi cập nhật số lượng:", error);

					setQuantity(quantity); //Set lại số lượng cũ
					toast.error("Không thể cập nhật số lượng");
				});
		} else {
			toast.warning("Số lượng tối thiểu là 1");
		}
	};

	// Xử lý khi người dùng nhập số lượng trực tiếp
	const handleQuantityChange = (newQuantity) => {
		const maxQuantity = props.cartItem.book?.quantity || 0;


		if (newQuantity < 1) {
			toast.warning("Số lượng tối thiểu là 1");
			return;
		}

		if (newQuantity > maxQuantity) {
			toast.warning("Số lượng sản phẩm đã đạt tối đa");
			return;
		}

		setQuantity(newQuantity);

		// Tạo cartItem mới với quantity mới
		const updatedCartItem = new CartItemModel(
			props.cartItem.idCart,
			newQuantity,
			props.cartItem.book,
			props.cartItem.idUser
		);

		// Gọi API cập nhật
		updateQuantityCartItem(updatedCartItem)
			.then(() => {
				// Gọi callback để reload giỏ hàng
				props.onDeleteSuccess();
			})
			.catch((error) => {
				console.error("Lỗi cập nhật số lượng:", error);

				setQuantity(props.cartItem.quantity || 1); //Set lại số lượng cũ
				toast.error("Không thể cập nhật số lượng");
			});
	};

	// Xử lý xoá sản phẩm
	const handleConfirm = () => {

		const isConfirmed = window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?");


		if (isToken() && isConfirmed) {
			const token = localStorage.getItem("token");
			fetch(endpointBE + `/cart-items/${props.cartItem.idCart}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"content-type": "application/json",
				},
			}).then(() => {
				toast.success("Xoá sản phẩm thành công");
				props.onDeleteSuccess(); // ← Gọi callback

			}).catch(
				(err) => {
					console.log(err);
					toast.error("Xóa sản phẩm thất bại");
				}
			);
		}
		else{
			toast.info("Đã hủy xóa sản phẩm");
		}
}

if (loading) {
	return (
		<>
			<Skeleton className='my-3' variant='rectangular' />
		</>
	);
}

if (erroring) {
	return (
		<>
			<h4>Đã xảy ra lỗi</h4>
		</>
	);
}
return (
	<>
		{props.cartItem.book && (
			<>
				<div className='col'>
					<div className='d-flex'>
						<Link to={`/book/${props.cartItem.book.idBook}`}>
							<img
								src={images?.[0].urlImage}
								className='card-img-top'
								alt={props.cartItem.book.nameBook}
								style={{ width: "100px" }} />
						</Link>
						<div className='d-flex flex-column pb-2'>
							<Link to={`/book/${props.cartItem.book.idBook}`}>
								<Tooltip title={props.cartItem.book.nameBook} arrow>
									<span className='d-inline'>
										<p>{props.cartItem.book.nameBook}</p>
									</span>
								</Tooltip>
							</Link>
							<div className='mt-auto'>
								<span className='discounted-price text-danger'>
									<strong style={{ fontSize: "22px" }}>
										{props.cartItem.book.sellPrice?.toLocaleString()}đ
									</strong>
								</span>
								<span
									className='original-price ms-3 small'
									style={{ color: "#000" }}
								>
									<del>
										{props.cartItem.book.listPrice?.toLocaleString()}đ
									</del>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-3 text-center my-auto d-flex align-items-center justify-content-center'>
					<SelectQuantity
						max={props.cartItem.book.quantity}
						quantity={quantity}
						add={handleIncrease}
						reduce={handleDecrease}
						setQuantity={handleQuantityChange}
						book={props.cartItem.book}
					/>
				</div>
				<div className='col-2 text-center my-auto'>
					<span className='text-danger'>
						{quantity && props.cartItem.book.sellPrice && (
							<strong>
								{(quantity * props.cartItem.book.sellPrice).toLocaleString()}đ
							</strong>
						)}
					</span>
				</div>
				<div className='col-2 text-center my-auto'>
					<Tooltip title={"Xoá sản phẩm"} arrow>
						<button
							style={{
								outline: 0,
								backgroundColor: "transparent",
								border: 0,

							}}
							onClick={() => handleConfirm()}

						>
							<DeleteOutlineOutlinedIcon sx={{ cursor: "pointer" }} />
						</button>
					</Tooltip>
				</div>
				<hr className='my-3' />
			</>
		)}
	</>
);
};

export default BookCartProps;
