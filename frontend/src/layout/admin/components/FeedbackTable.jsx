// File: ./components/feedback/FeedbackTable.jsx
// trang cụ thể quản lý feedback
// Đây là file "não" của trang admin. Nó gọi các API backend chính xác mà chúng ta đã tạo:

import { Box, CircularProgress, IconButton, Tooltip, Chip, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { VisibilityOutlined, CloseOutlined } from "@mui/icons-material";
import { getAllFeedback, markFeedbackAsRead, deleteFeedback } from "../../../api/FeedbackApi";

export const FeedbackTable = ({ 
    searchKeyword = "", 
    reloadKey = 0,
    onFeedbackSelected,
    onReload 
}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isDataChanged, setIsDataChanged] = useState(false);

    // [SỬA] Bước 1: Lấy danh sách feedback từ API dùng chung
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const feedbacks = await getAllFeedback();
                
                // Sắp xếp: feedback chưa đọc lên đầu
                const sortedFeedbacks = [...feedbacks].sort((a, b) => {
                    if (a.readed === b.readed) return 0;
                    return a.readed ? 1 : -1; // readed=false lên đầu
                });

                setData(sortedFeedbacks.map(fb => ({ ...fb, id: fb.idFeedback })));
            } catch (err) {
                toast.error("Lỗi khi tải danh sách feedback: " + err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [isDataChanged, reloadKey]);
    

    // [SỬA] Bước 2: Sửa API "Duyệt" dùng hàm từ FeedbackApi
    const handleChangeIsReaded = async (idFeedback) => {
        // Sửa lỗi logic: Tìm đúng feedback đang bấm
        const feedback = data.find(f => f.idFeedback === idFeedback);
        if (feedback?.readed === true) {
            toast.warning("Feedback này đã duyệt rồi");
            return;
        }

        toast.promise(
            markFeedbackAsRead(idFeedback)
                .then((success) => {
                    if (success) {
                        toast.success("Duyệt thành công");
                        setIsDataChanged(!isDataChanged); // Tải lại bảng
                    } else {
                        toast.error("Lỗi khi duyệt");
                    }
                })
                .catch((error) => {
                    toast.error("Lỗi khi duyệt");
                    console.log(error);
                }),
            { pending: "Đang trong quá trình xử lý ..." }
        );
    };

    // [SỬA] Bước 3: Hàm "Xóa" dùng hàm từ FeedbackApi
    const handleDelete = (idFeedback) => {
        if (!window.confirm("Bạn có chắc muốn xóa feedback này?")) {
            return;
        }

        toast.promise(
            deleteFeedback(idFeedback)
                .then((success) => {
                    if (success) {
                        toast.success("Xóa thành công");
                        setIsDataChanged(!isDataChanged); // Tải lại bảng
                    } else {
                        toast.error("Lỗi khi xóa");
                    }
                })
                .catch((error) => {
                    toast.error("Lỗi khi xóa");
                    console.log(error);
                }),
            { pending: "Đang trong quá trình xử lý ..." }
        );
    };

    // Lọc dữ liệu theo từ khóa tìm kiếm
    const filtered = useMemo(() => {
        if (!searchKeyword.trim()) return data;
        const k = searchKeyword.toLowerCase();
        return data.filter(f =>
            (f.title || '').toLowerCase().includes(k) ||
            (f.username || '').toLowerCase().includes(k) ||
            (f.comment || '').toLowerCase().includes(k)
        );
    }, [data, searchKeyword]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <div className="card">
                <div className="table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: "50px" }}>ID</th>
                                <th>TIÊU ĐỀ</th>
                                <th>NGƯỜI DÙNG</th>
                                <th>NHẬN XÉT</th>
                                <th style={{ width: "120px" }}>NGÀY TẠO</th>
                                <th style={{ width: "80px" }}>TRẠNG THÁI</th>
                                <th style={{ width: "120px" }}>HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        <Typography variant="body2" style={{ color: "#999" }}>
                                            Không có feedback nào
                                        </Typography>
                                    </td>
                                </tr>
                            )}
                            {filtered.map((feedback) => (
                                <tr key={feedback.idFeedback} style={{
                                    backgroundColor: feedback.readed ? "transparent" : "#f8f9fa",
                                    opacity: feedback.readed ? 0.7 : 1,
                                }}>
                                    <td>
                                        <strong>{feedback.idFeedback}</strong>
                                    </td>
                                    <td>
                                        <Typography variant="body2" style={{ fontWeight: 500, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {feedback.title}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="body2">
                                            {feedback.username || "N/A"}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="body2" style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {feedback.comment}
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography variant="caption" style={{ color: "#666" }}>
                                            {feedback.dateCreated ? new Date(feedback.dateCreated).toLocaleDateString('vi-VN') : "—"}
                                        </Typography>
                                    </td>
                                    <td>
                                        {feedback.readed ? (
                                            <Chip
                                                icon={<CheckIcon />}
                                                label="Đã đọc"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Chip
                                                label="Chưa đọc"
                                                size="small"
                                                color="warning"
                                                variant="outlined"
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => setSelectedFeedback(feedback)}
                                                >
                                                    <VisibilityOutlined fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            {!feedback.readed && (
                                                <Tooltip title="Đánh dấu đã đọc">
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleChangeIsReaded(feedback.idFeedback)}
                                                    >
                                                        <CheckIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Xóa">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDelete(feedback.idFeedback)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal xem chi tiết feedback */}
            {selectedFeedback && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            {/* Header */}
                            <div className="modal-header" style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                borderBottom: "none"
                            }}>
                                <h5 className="modal-title" style={{ margin: 0, fontWeight: 600 }}>
                                    Chi tiết Feedback
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setSelectedFeedback(null)}
                                ></button>
                            </div>

                            {/* Body */}
                            <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                                <div style={{ marginBottom: "20px" }}>
                                    <Typography variant="body2" style={{ color: "#666", marginBottom: "4px" }}>
                                        Tiêu đề
                                    </Typography>
                                    <Typography variant="h6" style={{ fontWeight: 600, marginBottom: "16px" }}>
                                        {selectedFeedback.title}
                                    </Typography>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                                    <div>
                                        <Typography variant="body2" style={{ color: "#666", marginBottom: "4px" }}>
                                            Người dùng
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {selectedFeedback.username || "N/A"}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body2" style={{ color: "#666", marginBottom: "4px" }}>
                                            Ngày tạo
                                        </Typography>
                                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                                            {selectedFeedback.dateCreated ? new Date(selectedFeedback.dateCreated).toLocaleString('vi-VN') : "—"}
                                        </Typography>
                                    </div>
                                </div>

                                <div style={{ marginBottom: "20px" }}>
                                    <Typography variant="body2" style={{ color: "#666", marginBottom: "8px" }}>
                                        Nhận xét
                                    </Typography>
                                    <div style={{
                                        padding: "12px",
                                        backgroundColor: "#f8f9fa",
                                        borderRadius: "6px",
                                        border: "1px solid #dee2e6",
                                        minHeight: "100px"
                                    }}>
                                        <Typography variant="body2" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                                            {selectedFeedback.comment}
                                        </Typography>
                                    </div>
                                </div>

                                <div style={{
                                    padding: "12px",
                                    backgroundColor: selectedFeedback.readed ? "#d4edda" : "#fff3cd",
                                    borderRadius: "6px",
                                    border: `1px solid ${selectedFeedback.readed ? "#c3e6cb" : "#ffeaa7"}`,
                                }}>
                                    <Typography variant="body2" style={{ fontWeight: 500 }}>
                                        {selectedFeedback.readed ? "✓ Đã duyệt" : "⚠ Chưa duyệt"}
                                    </Typography>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="modal-footer" style={{ borderTop: "1px solid #dee2e6" }}>
                                {!selectedFeedback.readed && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            handleChangeIsReaded(selectedFeedback.idFeedback);
                                            setSelectedFeedback(null);
                                        }}
                                    >
                                        <CheckIcon style={{ marginRight: "6px", fontSize: "18px" }} />
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        handleDelete(selectedFeedback.idFeedback);
                                        setSelectedFeedback(null);
                                    }}
                                >
                                    <DeleteIcon style={{ marginRight: "6px", fontSize: "18px" }} />
                                    Xóa
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedFeedback(null)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

