import { useEffect, useState } from "react";
import OrderDetail from "../../../model/OrderDetail";
import { getBookByIdOrderDetail } from "../../../api/BookApi";
import { Link } from "react-router-dom";
import { getAllImageByBook } from "../../../api/ImageApi";

const BookOrderDetail = (props) => {

    const [book, setBook] = useState();
    const [imageList, setImageList] = useState([]);

    useEffect(() => {

        getBookByIdOrderDetail(props.orderDetail.idOrderDetail)
            .then((response) => {
                setBook(response);

            })
            .catch((error) => {
                console.log(error);
            });

    }, [props.orderDetail.idOrderDetail])

    useEffect(() => {
        if (book?.idBook) {
            getAllImageByBook(book.idBook)
                .then((response) => {
                    setImageList(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [book?.idBook]);

    return (
        <>
            {book && (
                <div className='col-12'>
                    <div className='d-flex mb-3 pb-3' style={{ borderBottom: "1px solid #dee2e6" }}>
                        <Link to={`/book/${book.idBook}`}>
                            <img
                                src={imageList[0]?.urlImage ? imageList[0].urlImage : "/images/books/hinh_nen_sach.jpg"}
                                className='card-img-top'
                                alt={book.nameBook}
                                style={{ width: "100px" }}
                            />
                        </Link>
                        <div className='d-flex flex-column pb-2 ms-3 flex-grow-1'>
                            <Link to={`/book/${book.idBook}`} style={{ textDecoration: "none" }}>
                                <p style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
                                    {book.nameBook}
                                </p>
                            </Link>
                            <div className='mt-auto'>
                                <div className='mb-2'>
                                    <span className='discounted-price text-danger'>
                                        <strong style={{ fontSize: "22px" }}>
                                            {book.sellPrice?.toLocaleString()}đ
                                        </strong>
                                    </span>
                                    {book.discountPercent !== 0 && (
                                        <span className='original-price ms-3 small' style={{ color: "#000" }}>
                                            <del>{book.listPrice?.toLocaleString()}đ</del>
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <span style={{ fontSize: "14px", color: "#666" }}>
                                        Số lượng: <strong>{props.orderDetail.quantity}</strong>
                                    </span>
                                    <span className='ms-3 text-danger'>
                                        <strong>
                                            Tổng: {((props.orderDetail.quantity || 0) * (book.sellPrice || 0)).toLocaleString()}đ
                                        </strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookOrderDetail;
