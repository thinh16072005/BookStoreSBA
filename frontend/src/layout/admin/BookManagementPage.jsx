import React, { useState } from "react";
import { BookTable } from "./components/BookTable";
import BookModel from "../../model/BookModel";
import { BookForm } from "./components/BookForm";

const BookManagementPage = () => {
    const [keyCountReload, setKeyCountReload] = useState(0);
    const [selectedBook, setSelectedBook] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedBook(null);
    };

    const handleReload = () => {
        setKeyCountReload((prev) => prev + 1);
    };

    return (
        <div className='container my-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <h3>Quản lý sách</h3>
                <div className='d-flex gap-2'>
                    <input
                        className='form-control'
                        placeholder='Tìm theo tên sách hoặc tác giả...'
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <button
                        className='btn btn-primary'
                        onClick={handleOpenForm}
                    >
                        + Thêm sách mới
                    </button>
                </div>
            </div>

            {/* Bảng sách */}
            <BookTable
                keyCountReload={keyCountReload}
                setBookData={setSelectedBook}
                handleOpenForm={handleOpenForm}
                onDeleteSuccess={handleReload}
                searchKeyword={searchKeyword}
            />

            {/* Form thêm/sửa */}
            <BookForm
                open={openForm}
                onClose={handleCloseForm}
                bookData={selectedBook}
                onSuccess={handleReload}
            />
        </div>
    );
};



export default BookManagementPage;
