import React, { useEffect, useState } from "react";
import BookModel from "../../../model/BookModel";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IconButton, Tooltip } from "@mui/material";
import ImageModel from "../../../model/ImageModel";
import { endpointBE } from "../../utils/Constant";
import { toast } from "react-toastify";
import { getAllImageByBook } from "../../../api/ImageApi";

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

    }, [book.idBook]);


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
                                    // onClick={handleToggleFavorite}
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
