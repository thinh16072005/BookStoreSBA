import React, { useEffect, useMemo, useState } from "react";
import { getOrderById, getOrders, updateOrderStatus } from "../../api/OrderApi";
import OrderModel from "../../model/OrderModel";
import RequireAdmin from "./RequireAdmin";
import { toast } from "react-toastify";
import {
	PersonOutline,
	LocationOnOutlined,
	PaymentOutlined,
	LocalShippingOutlined,
	ReceiptOutlined,
	CalendarTodayOutlined,
	NoteOutlined,
	PhoneOutlined,
} from "@mui/icons-material";
import { Typography, Chip } from "@mui/material";
import { get1OrderDetail } from "../../api/OrderDetailApi";
import OrderDetail from "../../model/OrderDetail";
import { getBookByIdOrderDetail } from "../../api/BookApi";
import { getAllImageByBook } from "../../api/ImageApi";
import BookModel from "../../model/BookModel";
import ImageModel from "../../model/ImageModel";

// Tô màu badge theo trạng thái
const StatusBadge = ({ status }) => {
	const cls =
		status === "Thành công"
			? "badge bg-success-subtle text-success border border-success"
			: status === "Bị hủy"
				? "badge bg-danger-subtle text-danger border border-danger"
				: "badge bg-info-subtle text-info border border-info";
	return <span className={cls}>{status || "Đang xử lý"}</span>;
};

const getStatusColor = (status) => {
	if (status === "Thành công") return "success";
	if (status === "Đang xử lý") return "info";
	if (status === "Đang giao hàng") return "warning";
	return "error";
};

// Component hiển thị một sách trong đơn hàng
const BookOrderDetailItem = ({ orderDetail }) => {
	const [book, setBook] = useState(null);
	const [imageList, setImageList] = useState([]);

	useEffect(() => {
		getBookByIdOrderDetail(orderDetail.idOrderDetail)
			.then((response) => {
				setBook(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [orderDetail.idOrderDetail]);

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

	if (!book) return null;

	return (
		<div style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #dee2e6" }}>
			<img
				src={imageList[0]?.urlImage || "/images/books/hinh-nen-sach.jpg"}
				alt={book.nameBook}
				style={{ width: "80px", height: "110px", objectFit: "cover", borderRadius: "4px" }}
			/>
			<div style={{ flex: 1 }}>
				<Typography variant="body2" style={{ fontWeight: 600, color: "#333", marginBottom: "4px" }}>
					{book.nameBook}
				</Typography>
				<Typography variant="caption" style={{ color: "#999", marginBottom: "8px", display: "block" }}>
					Tác giả: {book.author || "—"}
				</Typography>
				<div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px" }}>
					<span style={{ color: "#d32f2f", fontWeight: 600, fontSize: "14px" }}>
						{book.sellPrice?.toLocaleString()}đ
					</span>
					{book.discountPercent !== 0 && (
						<span style={{ color: "#999", textDecoration: "line-through", fontSize: "12px" }}>
							{book.listPrice?.toLocaleString()}đ
						</span>
					)}
				</div>
				<div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#666" }}>
					<span>Số lượng: <strong>{orderDetail.quantity}</strong></span>
					<span className="text-danger">
						<strong>Tổng: {((orderDetail.quantity || 0) * (book.sellPrice || 0)).toLocaleString()}đ</strong>
					</span>
				</div>
			</div>
		</div>
	);
};

// Modal xem chi tiết đầy đủ của đơn hàng
const DetailModal = ({ order, onClose, onOrderUpdated }) => {
	const [orderDetails, setOrderDetails] = useState([]);
	const [loadingBooks, setLoadingBooks] = useState(false);
	const [updatingStatus, setUpdatingStatus] = useState(false);
	const [newStatus, setNewStatus] = useState("");

	useEffect(() => {
		if (order?.idOrder) {
			setLoadingBooks(true);
			get1OrderDetail(order.idOrder)
				.then((response) => {
					setOrderDetails(response);
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setLoadingBooks(false);
				});
			setNewStatus(order.status || "");
		}
	}, [order?.idOrder, order?.status]);

	const handleUpdateStatus = async () => {
		if (!order?.idOrder || !newStatus.trim()) {
			toast.warning("Vui lòng chọn trạng thái hợp lệ!");
			return;
		}

		if (newStatus === order.status) {
			toast.info("Trạng thái mới giống trạng thái cũ!");
			return;
		}

		setUpdatingStatus(true);
		try {
			await updateOrderStatus(order.idOrder, newStatus);
			toast.success("Cập nhật trạng thái đơn hàng thành công!");
			onOrderUpdated?.();
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Cập nhật trạng thái thất bại!");
		} finally {
			setUpdatingStatus(false);
		}
	};

	if (!order) return null;

	return (
		<div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					{/* Header */}
					<div className="modal-header bg-light">
						<div>
							<h5 className="modal-title" style={{ marginBottom: "4px" }}>
								Chi tiết đơn hàng
							</h5>
							<div style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a" }}>
								Đơn hàng <span style={{ color: "#9c27b0" }}>#{order.idOrder}</span>
							</div>
						</div>
						<button
							type="button"
							className="btn-close"
							onClick={onClose}
						></button>
					</div>

					{/* Body */}
					<div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
						{/* Status Bar */}
						<div
							style={{
								padding: "16px",
								backgroundColor: "#f8f9fa",
								borderRadius: "8px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
								border: "1px solid #dee2e6",
							}}
						>
							<div>
								<Typography variant="body2" style={{ color: "#666", marginBottom: "8px" }}>
									Trạng thái đơn hàng
								</Typography>
								<Chip
									label={order.status}
									color={getStatusColor(order.status)}
									size="small"
									style={{ fontWeight: 500 }}
								/>
							</div>
							<div style={{ textAlign: "right" }}>
								<Typography variant="body2" style={{ color: "#666", marginBottom: "8px" }}>
									Ngày đặt hàng
								</Typography>
								<Typography variant="body1" style={{ fontWeight: 500 }}>
									{order.dateCreated?.toString() || "—"}
								</Typography>
							</div>
						</div>

						{/* Two Column Layout */}
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "20px",
								marginBottom: "20px",
							}}
						>
							{/* Thông tin khách hàng */}
							<div>
								<Typography
									variant="h6"
									style={{
										fontWeight: 600,
										marginBottom: "12px",
										color: "#333",
									}}
								>
									Thông tin khách hàng
								</Typography>

								{/* Họ và tên */}
								<div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<PersonOutline fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Họ và tên
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.fullName || "—"}
										</Typography>
									</div>
								</div>

								{/* Số điện thoại */}
								<div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<PhoneOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Số điện thoại
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.phoneNumber || "—"}
										</Typography>
									</div>
								</div>

								{/* Địa chỉ giao hàng */}
								<div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<LocationOnOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Địa chỉ giao hàng
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.deliveryAddress || "—"}
										</Typography>
									</div>
								</div>

								{/* Ghi chú */}
								{order.note && (
									<div style={{ display: "flex", gap: "12px" }}>
										<div style={{ color: "#666", marginTop: "2px" }}>
											<NoteOutlined fontSize="small" />
										</div>
										<div style={{ flex: 1 }}>
											<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
												Ghi chú
											</Typography>
											<Typography variant="body1" style={{ fontWeight: 500 }}>
												{order.note}
											</Typography>
										</div>
									</div>
								)}
							</div>

							{/* Thông tin đơn hàng */}
							<div>
								<Typography
									variant="h6"
									style={{
										fontWeight: 600,
										marginBottom: "12px",
										color: "#333",
									}}
								>
									Thông tin đơn hàng
								</Typography>

								{/* Mã đơn hàng */}
								<div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<ReceiptOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Mã đơn hàng
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											#{order.idOrder}
										</Typography>
									</div>
								</div>

								{/* Ngày tạo */}
								<div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<CalendarTodayOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Ngày tạo
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.dateCreated?.toString() || "—"}
										</Typography>
									</div>
								</div>

								{/* Ngày nhận hàng dự kiến */}
								<div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<CalendarTodayOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" color="textSecondary" style={{ marginBottom: "4px" }}>
											Ngày nhận hàng dự kiến
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.dateCreated
												? (() => {
													const date = new Date(order.dateCreated);
													date.setDate(date.getDate() + 3);
													const year = date.getFullYear();
													const month = `${date.getMonth() + 1}`.padStart(2, "0");
													const day = `${date.getDate()}`.padStart(2, "0");
													return `${year}-${month}-${day}`;
												})()
												: "—"}
										</Typography>
									</div>
								</div>


								{/* Phương thức thanh toán */}
								<div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<PaymentOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Phương thức thanh toán
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.namePayment || "—"}
										</Typography>
									</div>
								</div>

								{/* Phương thức vận chuyển */}
								<div style={{ display: "flex", gap: "12px" }}>
									<div style={{ color: "#666", marginTop: "2px" }}>
										<LocalShippingOutlined fontSize="small" />
									</div>
									<div style={{ flex: 1 }}>
										<Typography variant="body2" style={{ color: "#999", marginBottom: "2px" }}>
											Phương thức vận chuyển
										</Typography>
										<Typography variant="body1" style={{ fontWeight: 500 }}>
											{order.nameDelivery || "—"}
										</Typography>
									</div>
								</div>
							</div>
						</div>

						{/* Price Summary */}
						<div
							style={{
								padding: "16px",
								backgroundColor: "#f8f9fa",
								borderRadius: "8px",
								border: "1px solid #dee2e6",
							}}
						>
							<Typography
								variant="h6"
								style={{
									fontWeight: 600,
									marginBottom: "12px",
									color: "#333",
								}}
							>
								Chi tiết thanh toán
							</Typography>

							{/* Tổng tiền sản phẩm */}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "8px",
								}}
							>
								<Typography variant="body2" style={{ color: "#666" }}>
									Tổng tiền sản phẩm
								</Typography>
								<Typography variant="body2" style={{ fontWeight: 500 }}>
									{Number(order.totalPriceProduct).toLocaleString("vi-VN")} đ
								</Typography>
							</div>

							{/* Phí vận chuyển */}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "8px",
								}}
							>
								<Typography variant="body2" style={{ color: "#666" }}>
									Phí vận chuyển
								</Typography>
								<Typography variant="body2" style={{ fontWeight: 500 }}>
									{Number(order.feeDelivery).toLocaleString("vi-VN")} đ
								</Typography>
							</div>

							{/* Phí thanh toán */}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: "12px",
								}}
							>
								<Typography variant="body2" style={{ color: "#666" }}>
									Phí thanh toán
								</Typography>
								<Typography variant="body2" style={{ fontWeight: 500 }}>
									{Number(order.feePayment).toLocaleString("vi-VN")} đ
								</Typography>
							</div>

							{/* Divider */}
							<div
								style={{
									borderTop: "2px solid #e0e0e0",
									marginTop: "12px",
									paddingTop: "12px",
								}}
							>
								{/* Tổng thanh toán */}
								<div style={{ display: "flex", justifyContent: "space-between" }}>
									<Typography variant="h6" style={{ fontWeight: 600 }}>
										Tổng thanh toán
									</Typography>
									<Typography
										variant="h6"
										style={{ fontWeight: 700, color: "#d32f2f" }}
									>
										{Number(order.totalPrice).toLocaleString("vi-VN")} đ
									</Typography>
								</div>
							</div>
						</div>
					</div>

					{/* Phần Các sách có trong đơn hàng */}
					<div
						style={{
							marginTop: "20px",
							padding: "16px",
							backgroundColor: "#f8f9fa",
							borderRadius: "8px",
							border: "1px solid #dee2e6",
						}}
					>
						<Typography
							variant="h6"
							style={{
								fontWeight: 600,
								marginBottom: "12px",
								color: "#333",
							}}
						>
							Các sách có trong đơn hàng
						</Typography>

						{loadingBooks ? (
							<Typography variant="body2" style={{ color: "#999", textAlign: "center" }}>
								Đang tải dữ liệu sách...
							</Typography>
						) : orderDetails.length === 0 ? (
							<Typography variant="body2" style={{ color: "#999", textAlign: "center" }}>
								Không có sách trong đơn hàng
							</Typography>
						) : (
							<div>
								{orderDetails.map((orderDetail) => (
									<BookOrderDetailItem key={orderDetail.idOrderDetail} orderDetail={orderDetail} />
								))}
							</div>
						)}
					</div>

					{/* Status Update Section */}
					<div
						style={{
							marginTop: "20px",
							padding: "16px",
							backgroundColor: "#f8f9fa",
							borderRadius: "8px",
							border: "1px solid #dee2e6",
						}}
					>
						<Typography
							variant="h6"
							style={{
								fontWeight: 600,
								marginBottom: "12px",
								color: "#333",
							}}
						>
							Cập nhật trạng thái đơn hàng
						</Typography>
						<div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
							<div style={{ flex: 1 }}>
								<label style={{ display: "block", marginBottom: "6px", color: "#666", fontWeight: 500 }}>
									Trạng thái mới
								</label>
								<select
									className="form-select"
									value={newStatus}
									onChange={(e) => setNewStatus(e.target.value)}
									disabled={updatingStatus}
									style={{
										padding: "8px 12px",
										border: "1px solid #dee2e6",
										borderRadius: "4px",
									}}
								>
									<option value="">-- Chọn trạng thái --</option>
									<option value="Đang xử lý">Đang xử lý</option>
									<option value="Đang giao hàng">Đang giao hàng</option>
									<option value="Thành công">Thành công</option>
									<option value="Bị hủy">Bị hủy</option>
								</select>
							</div>
							<button
								className="btn btn-primary"
								onClick={handleUpdateStatus}
								disabled={updatingStatus || !newStatus}
								style={{
									padding: "8px 24px",
									fontWeight: 500,
								}}
							>
								{updatingStatus ? "Đang cập nhật..." : "Cập nhật"}
							</button>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
};

const OrderManagement = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState({ number: 0, size: 10, totalPages: 1, totalElements: 0 });
	const [keyword, setKeyword] = useState("");
	const [detail, setDetail] = useState(null);
	const [isSearching, setIsSearching] = useState(false);

	// Nạp danh sách đơn theo trang
	const load = async (p = page.number, s = page.size) => {
		setLoading(true);
		try {
			const { items, page: pi } = await getOrders(p, s, "idOrder,desc");
			setOrders(items);
			setPage({
				number: pi.number,
				size: pi.size,
				totalPages: pi.totalPages,
				totalElements: pi.totalElements,
			});
		} catch (e) {
			console.error(e);
			toast.error("Không tải được danh sách đơn hàng!");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load(0, page.size);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Lọc theo tên khách hàng
	const filtered = useMemo(() => {
		if (!keyword.trim()) return orders;
		const k = keyword.toLowerCase();
		return orders.filter((o) => (o.fullName || "").toLowerCase().includes(k));
	}, [orders, keyword]);

	// Xử lý khi thay đổi từ khóa tìm kiếm
	const handleSearchChange = async (e) => {
		const searchTerm = e.target.value;
		setKeyword(searchTerm);

		// Nếu có nhập từ khóa tìm kiếm, load toàn bộ dữ liệu
		if (searchTerm.trim()) {
			setIsSearching(true);
			setLoading(true);
			try {
				const { items } = await getOrders(0, 1000, "idOrder,desc"); // Load up to 1000 records
				setOrders(items);
				setPage((prev) => ({ ...prev, number: 0 }));
			} catch (e) {
				console.error(e);
				toast.error("Không tải được danh sách đơn hàng!");
			} finally {
				setLoading(false);
			}
		} else {
			// Nếu xóa từ khóa, quay lại chế độ phân trang bình thường
			setIsSearching(false);
			load(0, page.size);
		}
	};

	// Xem chi tiết: gọi GET 1 đơn từ backend để đồng bộ trạng thái mới nhất
	const onView = async (id) => {
		try {
			const orders = await (getOrderById(id));
			setDetail(orders);
		} catch {
			toast.error("Không tải được chi tiết đơn!");
		}
	};

	// Refresh danh sách khi có cập nhật trạng thái
	const onOrderUpdated = () => {
		load(page.number, page.size);
	};

	return (
		<div className="container my-4">
			<div className="d-flex align-items-center justify-content-between mb-3">
				<h3>Quản lý đơn hàng</h3>
				<div className="d-flex gap-2">
					<input
						className="form-control"
						placeholder="Tìm theo tên khách hàng..."
						value={keyword}
						onChange={handleSearchChange}
						style={{ width: 300 }}
					/>
				</div>
			</div>

			<div className="card">
				<div className="table-responsive">
					<table className="table align-middle">
						<thead>
							<tr>
								<th>ID</th>
								<th>Tên khách hàng</th>
								<th>Ngày tạo</th>
								<th>Tổng tiền</th>
								<th>Trạng thái</th>
								<th>Thanh toán</th>
								<th>Hành động</th>
							</tr>
						</thead>
						<tbody>
							{loading && (
								<tr>
									<td colSpan={7} className="text-center">
										Đang tải...
									</td>
								</tr>
							)}
							{!loading && filtered.length === 0 && (
								<tr>
									<td colSpan={7} className="text-center">
										Không có dữ liệu
									</td>
								</tr>
							)}
							{!loading &&
								filtered.map((o) => (
									<tr key={o.idOrder}>
										<td>{o.idOrder}</td>
										<td>{o.fullName}</td>
										<td>{String(o.dateCreated)}</td>
										<td>{o.totalPrice?.toLocaleString()} đ</td>
										<td>
											<StatusBadge status={o.status} />
										</td>
										<td>{o.namePayment || "—"}</td>
										<td>
											<button
												className="btn btn-sm btn-outline-primary me-2"
												onClick={() => onView(o.idOrder)}
											>
												<i className="far fa-eye"></i>
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
				<div className="d-flex align-items-center justify-content-between p-2">
					<div className="text-muted">
						{isSearching ? (
							`Tìm thấy ${filtered.length} kết quả`
						) : (
							`Trang ${page.number + 1} / ${Math.max(1, page.totalPages)}`
						)}
					</div>
					{!isSearching && (
						<div className="btn-group">
							<button
								className="btn btn-outline-secondary"
								disabled={page.number <= 0}
								onClick={() => load(page.number - 1, page.size)}
							>
								«
							</button>
							<button
								className="btn btn-outline-secondary"
								disabled={page.number >= page.totalPages - 1}
								onClick={() => load(page.number + 1, page.size)}
							>
								»
							</button>
						</div>
					)}
				</div>
			</div>

			<DetailModal order={detail} onClose={() => setDetail(null)} onOrderUpdated={onOrderUpdated} />
		</div>
	);
};

const OrderManagementPage = RequireAdmin(OrderManagement);
export default OrderManagementPage;
