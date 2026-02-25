import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import { getAllImageByBook } from "../../../api/ImageApi";
import { addFavoriteBook, removeFavoriteBook, getFavoriteBooksByUser } from "../../../api/FavouriteBookApi";
import { getIdUserByToken, isToken } from "../../utils/JwtService";
import { toast } from "react-toastify";

const BookProps = ({ book, onRemove, isFavoritePage = false }) => {
    const navigation = useNavigate();
    const [imageList, setImageList] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Lấy hình ảnh sách
        getAllImageByBook(book.idBook)
            .then((response) => {
                setImageList(response);
            })
            .catch((error) => {
                console.log(error);
            });

        // Kiểm tra sách có trong danh sách yêu thích không
        if (isToken()) {
            checkIfFavorite();
        }
    }, [book.idBook]);

    // Kiểm tra sách có trong danh sách yêu thích không
    const checkIfFavorite = async () => {
        try {
            const idUser = getIdUserByToken();
            if (!idUser || typeof idUser !== 'number') return;

            const favoriteIds = await getFavoriteBooksByUser(idUser);
            setIsFavorite(favoriteIds.includes(book.idBook));
        } catch (error) {
            console.error("Lỗi khi kiểm tra yêu thích:", error);
        }
    };

 
    


    // Xử lý thêm/xóa yêu thích
    const handleToggleFavorite = async () => {
        // Kiểm tra đăng nhập
        if (!isToken()) {
            alert("Vui lòng đăng nhập để sử dụng tính năng này");
            navigation("/login");
            return;
        }

        const idUser = Number(getIdUserByToken());
        if (!idUser || typeof idUser !== 'number') return;

        setLoading(true);

        if (isFavorite) {
            // Xóa khỏi danh sách yêu thích
            await removeFavoriteBook(idUser, book.idBook);
            setIsFavorite(false);
            toast.error("Đã xóa khỏi danh sách yêu thích");

            // Nếu đang ở trang yêu thích, refresh lại danh sách
            if (isFavoritePage && onRemove) {
                onRemove();
            }
        } else {
            // Thêm vào danh sách yêu thích
            await addFavoriteBook(idUser, book.idBook);
            setIsFavorite(true);
            toast.success("Đã thêm vào danh sách yêu thích");
        }

        setLoading(false);

    };

    return (
        <div className='col-md-6 col-lg-3 mt-3'>
            <div className='card position-relative'>
                {book.discountPercent !== 0 && (
                    <h4
                        className='my-0 d-inline-block position-absolute end-0'
                        style={{ top: "15px" }}
                    >
                        {book.quantity === 0 ? (
                            <span className='badge bg-danger'>Hết hàng</span>
                        ) : (
                            <span className='badge bg-primary'>
                                {book.discountPercent}%
                            </span>
                        )}
                    </h4>
                )}
                <Link to={`/book/${book.idBook}`}>
                    <img
                        src={imageList[0]?.urlImage ? imageList[0].urlImage : "/images/books/hinh_nen_sach.jpg"}
                        className='card-img-top mt-3'
                        alt={book.nameBook}
                        style={{ height: "300px" }}
                    />
                </Link>
                <div className='card-body'>
                    <Link
                        to={`/book/${book.idBook}`}
                        style={{ textDecoration: "none" }}
                    >
                        <h5 className='card-title'>
                            <Tooltip title={book.nameBook} arrow>
                                <span
                                    style={{
                                        display: 'block',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {book.nameBook}
                                </span>
                            </Tooltip>
                        </h5>
                    </Link>
                    <div className='price mb-3 d-flex align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                            <span className='discounted-price text-danger'>
                                <strong style={{ fontSize: "22px" }}>
                                    {book.sellPrice?.toLocaleString()}đ
                                </strong>
                            </span>
                            {book.discountPercent !== 0 && (
                                <span className='original-price ms-3 small fw-bolder'>
                                    <del>{book.listPrice?.toLocaleString()}đ</del>
                                </span>
                            )}
                        </div>
                        <span
                            className='ms-2'
                            style={{ fontSize: "12px", color: "#aaa" }}
                        >
                            Đã bán {book.soldQuantity}
                        </span>
                    </div>

                    <div className='row mt-2' role='group'>
                        <div className='col-6'>
                            <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
                                <button
                                    className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-secondary'}`}
                                    onClick={handleToggleFavorite}
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {isFavorite ? '❤️' : '🤍'}
                                </button>
                            </Tooltip>
                        </div>
                        <div className='col-6'>
                            {book.quantity !== 0 && (
                                <Tooltip title='Thêm vào giỏ hàng'>
                                    <button
                                        className='btn btn-primary btn-block'
                                        // onClick={isToken() ? () => handleAddProduct(book) : () => navigation("/login")}

                                    >
                                        <i className='fas fa-shopping-cart'></i>
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BookProps;
