import { useCallback, useEffect, useState } from "react";
import { getAllBook } from "../../../api/BookApi";
import { getAllImageByBook } from "../../../api/ImageApi";
import { DataTable } from "../../utils/DataTable";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";
import { endpointBE } from "../../utils/Constant";

export const BookTable = (props) => {
	const [loading, setLoading] = useState(true);
	// State cho Dialog xoá sách
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [data, setData] = useState([]);

	// Tạo biến để lấy tất cả data
	const [filteredData, setFilteredData] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

	// Hàm để lấy tất cả các sách render ra table
	const loadAllBooks = async () => {
        try {
            const bookResponse = await getAllBook(1000, 0);
            
            const promises = bookResponse.bookList.map(async (book) => {
                const imagesList = await getAllImageByBook(book.idBook);
                const firstImage = imagesList[0];

                return {
                    ...book,
                    id: book.idBook,
                    thumbnail: firstImage?.urlImage || firstImage?.dataImage || "/images/books/hinh_nen_sach.jpg",
                };
            });
            
            const books = await Promise.all(promises);
            setAllBooks(books);
            return books;
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách sách!");
            return [];
        }
    };

    const loadBooks = async (page = 0) => {
        setLoading(true);
        try {
            // Không có tìm kiếm → load theo trang
            const bookResponse = await getAllBook(pageSize, page);
            
            const promises = bookResponse.bookList.map(async (book) => {
                const imagesList = await getAllImageByBook(book.idBook);
                const firstImage = imagesList[0];

                return {
                    ...book,
                    id: book.idBook,
                    thumbnail: firstImage?.urlImage || firstImage?.dataImage || "/images/books/hinh_nen_sach.jpg",
                };
            });
            
            const books = await Promise.all(promises);
            setData(books);
            setFilteredData(books);
            setCurrentPage(page);
            setTotalPages(bookResponse.totalPages);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách sách!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllBooks().then(() => {
            loadBooks(0);
        });
    }, [props.keyCountReload]);

    useEffect(() => {
        if (!props.searchKeyword || props.searchKeyword.trim() === "") {
            // Không có từ khóa → hiển thị data trang hiện tại
            setFilteredData(data);
        } else {
            // Có từ khóa → tìm trong allBooks
            const keyword = props.searchKeyword.toLowerCase().trim();
            const filtered = allBooks.filter((book) => {
                const nameMatch = book.nameBook?.toLowerCase().includes(keyword);
                const authorMatch = book.author?.toLowerCase().includes(keyword);
                return nameMatch || authorMatch;
            });
            setFilteredData(filtered);
        }
    }, [props.searchKeyword, data, allBooks]);

	const handleEdit = (book) => {
    if (props.setBookData) {
        props.setBookData(book);
    }
    
    if (props.handleOpenForm) {
        props.handleOpenForm();
    }
	};

	// Hàm mở dialog xoá sách
    const handleOpenDeleteDialog = (idBook, nameBook) => {
        setBookToDelete({ id: idBook, name: nameBook });
        setOpenDeleteDialog(true);
    };

    // Hàm đóng dialog xoá sách
    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setBookToDelete(null);
    };

    // Hàm xử lý xóa sách
    const handleConfirmDelete = useCallback(async () => {
        if (!bookToDelete) {
            console.log("No book to delete");
            return;
        }

		console.log("===== DELETE BOOK =====");
    console.log("Book ID:", bookToDelete.id);
    console.log("Book Name:", bookToDelete.name);
        setDeleting(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Vui lòng đăng nhập!");
                setDeleting(false);
                return;
            }

            const response = await fetch(
                `${endpointBE}/books/delete-by-id/${bookToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
                    },
                }
            );

            console.log("Response status:", response.status);

            if (response.status === 200) {
            // thành công
            console.log("DELETE SUCCESS - Status 200");
            
            toast.success("Xóa sách thành công!");
            handleCloseDeleteDialog();

            if (props.onDeleteSuccess) {
                    props.onDeleteSuccess();
                }   
            } else if (response.status === 400) {
            // lỗi không thể xóa do đã có khách hàng mua
            try {
                const errorText = await response.text();
                toast.error(errorText || "Không thể xóa sách này");
            } catch (e) {
                toast.error("Không thể xóa sách này vì đã có khách hàng mua");
            }
            
        } else {
            //lôi khác
            console.error("Error status:", response.status);
            toast.error(`Lỗi ${response.status}`);
        }
        
    } catch (error) {
        console.error("===== DELETE ERROR =====");
        console.error(error);
        
        // Kiểm tra lỗi kết nối
        if (error.name === "TypeError" || error.message.includes("fetch")) {
            toast.error("Lỗi kết nối đến server");
        }
    } finally {
        setDeleting(false);
    }
    }, [bookToDelete, props]);

    const columns = [
		{ field: "id", headerName: "ID", width: 80 },
		{
			field: "thumbnail",
			headerName: "ẢNH",
			width: 100,
			renderCell: (params) => {
				return <img src={params.value} alt='' width={70} />;
			},
		},
		{ field: "nameBook", headerName: "TÊN SÁCH", width: 350 },
		{ field: "quantity", headerName: "SỐ LƯỢNG", width: 100 },
		{
			field: "sellPrice",
			headerName: "GIÁ BÁN",
			width: 120,
			renderCell: (params) => {
				return (
					<span>
						{Number.parseInt(params.value).toLocaleString("vi-vn")}đ
					</span>
				);
			},
		},
		{ field: "author", headerName: "TÁC GIẢ", width: 150 },

		{
			field: "action",
			headerName: "HÀNH ĐỘNG",
			width: 200,
			type: "actions",
			renderCell: (item) => {
				return (
					<div>
						<Tooltip title={"Chỉnh sửa"}>
							<IconButton
								color='primary'
								onClick={() => handleEdit(item.row)}
								size="small"
							>
								<EditOutlinedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={"Xoá"}>
							<IconButton
								color='error'
								onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log("===== DELETE BUTTON CLICKED =====");
                                    console.log("Book ID:", item.row.idBook);
                                    console.log("Book Name:", item.row.nameBook);
                                    handleOpenDeleteDialog(item.row.idBook, item.row.nameBook || "");
                                }}
                                size="small"
							>
								<DeleteOutlineOutlined />
							</IconButton>
						</Tooltip>
					</div>
				);
			},
		},
	];

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	if (data.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <span style={{ fontSize: "1.2rem", color: "#666" }}>
                    Không có sách nào
                </span>
            </Box>
        );
    }


    if (filteredData.length === 0 && !loading) {
        return (
            <Box sx={{ width: "100%" }}>
                
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 400,
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <span style={{ fontSize: "1.2rem", color: "#666" }}>
                        {props.searchKeyword 
                            ? `Không tìm thấy sách nào với từ khóa "${props.searchKeyword}"`
                            : "Không có sách nào"
                        }
                    </span>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>

            <Box
                sx={{
                    bgcolor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                }}
            >
                {/* BẢNG DANH SÁCH SÁCH */}
                <DataTable columns={columns} rows={filteredData} hideFooter={true} />

                {/* PHÂN TRANG */}
                <Box
                    sx={{
                        borderTop: "1px solid #e0e0e0",
                        bgcolor: "#fafafa",
                        padding: "12px 16px",
                    }}
                >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                        {/* Chỉ hiển thị phân trang khi không có tìm kiếm */}
                        {!props.searchKeyword?.trim() ? (
                            <>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={currentPage === 0}
                                    onClick={() => loadBooks(currentPage - 1)}
                                    style={{ textTransform: "uppercase", fontSize: "12px", padding: "4px 12px" }}
                                >
                                    Trước
                                </button>
                                <span className="text-muted" style={{ fontSize: "14px" }}>
                                    Trang {currentPage + 1} / {totalPages}
                                </span>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => loadBooks(currentPage + 1)}
                                    style={{ textTransform: "uppercase", fontSize: "12px", padding: "4px 12px" }}
                                >
                                    Sau
                                </button>
                            </>
                        ) : (
                            <span className="text-muted" style={{ fontSize: "14px" }}>
                                Hiển thị {filteredData.length} kết quả tìm kiếm
                            </span>
                        )}
                    </div>
                </Box>
            </Box>

            {/* DIALOG XÁC NHẬN XÓA */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle 
                    id="delete-dialog-title" 
                    sx={{ 
                        color: "#d32f2f", 
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                    }}
                >
                    Xác nhận xóa sách
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bạn có chắc chắn muốn xóa sách{" "}
                        <strong style={{ color: "#000" }}>"{bookToDelete?.name}"</strong>?
                        <br />
                        <br />
                        <span style={{ color: "#d32f2f" }}>
                            Hành động này không thể hoàn tác!
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2, gap: 1 }}>
                    <Button 
                        onClick={() => {
                            console.log("===== CANCEL BUTTON CLICKED =====");
                            handleCloseDeleteDialog();
                        }}
                        disabled={deleting}
                        variant="outlined"
                        color="inherit"
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={(e) => {
                            console.log("===== CONFIRM DELETE BUTTON CLICKED =====");
                            e.preventDefault();
                            e.stopPropagation();
                            handleConfirmDelete();
                        }}
                        disabled={deleting}
                        variant="contained"
                        color="error"
                        autoFocus
                    >
                        {deleting ? "Đang xóa..." : "Xóa"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
