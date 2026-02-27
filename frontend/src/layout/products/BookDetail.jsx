import { useNavigate, useParams } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useEffect, useState } from "react";
import BookModel from "../../model/BookModel";
import { getBookById } from "../../api/BookApi";
import GenreModel from "../../model/GenreModel";
import { getGenreByIdBook } from "../../api/GenreApi";
import ImageModel from "../../model/ImageModel";
import { getAllImageByBook } from "../../api/ImageApi";
import { Button, Skeleton } from "@mui/material";
import RatingStar from "./components/rating/Rating";
import SelectQuantity from "./components/select-quantity/SelectQuantity";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Comment from "./components/comment/Comment";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import CartItemModel from "../../model/CartItemModel";
import { CheckoutPage } from "../pages/CheckoutPage";
import { getCartAllByIdUser, updateQuantityCartItem } from "../../api/CartApi";

const BookDetail = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const navigate = useNavigate();

	const [cartList, setCartList] = useState([]); //Xử lý cho buy now
	const [totalPriceProduct, setTotalPriceProduct] = useState(0); //Xử lý cho buy now
	const [isCheckout, setIsCheckout] = useState(false); //Xử lý cho buy now

	// Lấy mã sách từ url
	const { idBook } = useParams();
	let idBookNumber = 0;

	// Ép kiểu về number
	try {
		idBookNumber = parseInt(idBook + "");
		if (Number.isNaN(idBookNumber)) {
			idBookNumber = 0;
		}
	} catch (error) {
		console.error("Error: " + error);
	}

	// Khai báo biến
	const [book, setBook] = useState(null);
	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);
	// Lấy sách ra
	useEffect(() => {
		getBookById(idBookNumber)
			.then((response) => {
				setBook(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, []);

	// Lấy ra thể loại của sách
	const [genres, setGenres] = useState(null);
	useEffect(() => {
		getGenreByIdBook(idBookNumber).then((response) => {
			setGenres(response);
		});
	}, []);

	// Lấy ra hình ảnh của sách
	const [images, setImages] = useState(null);
	useEffect(() => {
		getAllImageByBook(idBookNumber)
			.then((response) => {
				setImages(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	//Tạo biến số lượng
	const [quantity, setQuantity] = useState(1);
	// Xử lý tăng số lượng
	const add = () => {
		//không được vượt quá số lượng sách có sẵn
		if (quantity < (book?.quantity ? book?.quantity : 1)) {
			setQuantity(quantity + 1);
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		//không được giảm dưới 1
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	// Xử lý thêm sản phẩm vào giỏ hàng
	const handleAddProduct = async (book) => {

		//Xử lý khi đã có sách sẵn trong giỏ hàng
		const cartList = await getCartAllByIdUser();
		//Xử dụng find để tìm sách trong giỏ hàng
		const existing = cartList.find(
			(cartItem) => cartItem.book?.idBook === book.idBook
		);

		if (existing) {
			existing.quantity = (existing.quantity || 1) + quantity;
			try {
				await updateQuantityCartItem(existing);
			} catch (error) {
				console.error(error);
			}
			return;
		}



		//Thêm sản phẩm vào giỏ hàng
		const endPoint = endpointBE + "/cart-item/add-item";

		const token = localStorage.getItem("token");
		const idUser = Number(getIdUserByToken());

		try {
			const response = await toast.promise(
				fetch(endPoint, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
						"Authorization": "Bearer " + token,
					},
					body: JSON.stringify({
						idBook: book.idBook,
						quantity: quantity,
						idUser: idUser,
					}),
				}),
				{ pending: "Đang trong quá trình xử lý ..." }
			);
			if (response.ok) {
				toast.success("Đã thêm sản phẩm vào giỏ hàng");
			} else {
				toast.error("Đã xảy ra lỗi");
			}
		} catch (error) {
			toast.error("Đã xảy ra lỗi");
		}
	}

	const handleBuyNow = (book) => {
		setCartList([
			{
				book: book,
				quantity: quantity,
				idUser: Number(getIdUserByToken()),
			}
		])

		if (book.sellPrice) {
			setTotalPriceProduct(book.sellPrice * quantity);
		}
		setIsCheckout(!isCheckout);
	}

	if (loading) {
		return (
			<div className='container-book container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-4'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-8 px-5'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={100}
						/>
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
			</div>
		);
	}

	if (book === null) {
		return (
			<div>
				<h1>Sách không tồn tại </h1>
			</div>
		);
	}

	return (
		<>
			{isCheckout ? (
				<CheckoutPage
					cartList={cartList}
					totalPriceProduct={totalPriceProduct}
					setIsCheckout={setIsCheckout}
				/>
			) : (
				<>
					<div className='container p-2 bg-white my-3 rounded'>
						<div className='row mt-4 mb-4'>
							<div className='col-lg-4 col-md-4 col-sm-12'>
								<Carousel
									emulateTouch={true}
									swipeable={true}
									showIndicators={false}
									showArrows={true}
								>
									{/* Hiển thị ảnh của sách */}
									{images?.map((image, index) => (
										<div
											key={index}
											style={{
												width: "100%",
												height: "400px",
												objectFit: "cover",
											}}>
											<img
												alt=''
												src={
													image.urlImage
												}
											/></div>

									))}
								</Carousel>
							</div>
							<div className='col-lg-8 col-md-8 col-sm-12 px-5'>
								<h2>{book.nameBook}</h2>
								<div className='d-flex align-items-center'>
									<p className='me-5'>
										Thể loại:{" "}
										<strong>
											{genres?.map((genre) => genre.nameGenre + " ")}
										</strong>
									</p>
									<p className='ms-5'>
										Tác giả: <strong>{book.author}</strong>
									</p>
								</div>
								<div className='d-flex align-items-center'>
									<div className='d-flex align-items-center'>
										{/* Hiển thị sao */}
										<RatingStar
											readonly={true}
											ratingPoint={book.avgRating}
										/>

										{/* Hiển thị số sao */}
										<p className='text-danger ms-2 mb-0'>
											({book.avgRating})
										</p>
									</div>
									<div className='d-flex align-items-center'>
										<span className='mx-3 mb-1 text-secondary'>
											|
										</span>
									</div>
									<div className='d-flex align-items-end justify-content-center '>
										<span
											style={{
												color: "rgb(135,135,135)",
												fontSize: "16px",
											}}
										>
											Đã bán
										</span>
										<span className='fw-bold ms-2'>
											{book.soldQuantity}
										</span>
									</div>
								</div>
								<div className='price'>
									<span className='discounted-price text-danger me-3'>
										<strong style={{ fontSize: "32px" }}>
											{book.sellPrice?.toLocaleString()}đ
										</strong>
									</span>
									<span className='original-price small me-3'>
										<strong>
											<del>{book.listPrice?.toLocaleString()}đ</del>
										</strong>
									</span>
									<h4 className='my-0 d-inline-block'>
										<span className='badge bg-danger'>
											{book.discountPercent}%
										</span>
									</h4>
								</div>
								<div className='mt-3'>
									<div className='d-flex align-items-center mt-3'>
										{/* Hiển thị hình ảnh miễn phí vận chuyển */}
										<img
											src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/d9e992985b18d96aab90969636ebfd0e.png'
											height='20'
											alt='free ship'
										/>
										<span className='ms-3'>Miễn phí vận chuyển</span>
									</div>
								</div>
								<div className='d-flex align-items-center mt-3'>
									{/* Hiển thị số lượng */}
									<strong className='me-5'>Số lượng: </strong>
									<SelectQuantity
										max={book.quantity}
										quantity={quantity}
										add={add}
										reduce={reduce}
										setQuantity={setQuantity}
									/>
									<span className='ms-4'>
										{book.quantity} sản phẩm có sẵn
									</span>
								</div>
								<div className='mt-4 d-flex align-items-center'>
									{book.quantity === 0 ? (
										<Button
											variant='outlined'
											size='large'
											className='me-3'
											color='error'
										>
											Hết hàng
										</Button>
									) : (
										<>
											<Button
												variant='outlined'
												size='large'
												startIcon={<ShoppingCartOutlined />}
												className='me-3'
												onClick={isToken() ? () => handleAddProduct(book) : () => navigate("/login")}
											>
												Thêm vào giỏ hàng
											</Button>
											<Button
												variant='contained'
												size='large'
												className='ms-3'
												onClick={isToken() ? () => handleBuyNow(book) : () => navigate("/login")}
											>
												Mua ngay
											</Button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='container p-4 bg-white my-3 rounded'>
						<h5 className='my-3'>Mô tả sản phẩm</h5>
						<hr />
						<p>{book.description}</p>
					</div>
					<div className='container p-4 bg-white my-3 rounded'>
						<h5 className='my-3'>Khách hàng đánh giá</h5>
						<hr />
						<Comment idBook={idBookNumber} />
					</div>
				</>
			)}
		</>
	);
};

export default BookDetail;
