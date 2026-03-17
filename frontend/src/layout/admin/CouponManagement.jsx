import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import RequireAdmin from './RequireAdmin';
import Coupon from '../../model/Coupon';
import { createCoupon, deleteCoupon, getCoupon, updateActiveCoupon } from '../../api/CouponApi';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Pagination, Box } from '@mui/material';

const emptyForm = { discountPercent: 0, expiryDate: '' };

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [quantity, setQuantity] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const fetchCoupons = (page = 1) => {
        setLoading(true);
        getCoupon(page - 1, pageSize)
            .then((response) => {
                setCoupons(response.coupons);
                setTotalPages(response.totalPages);
                setCurrentPage(page);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching coupons:', error);
                toast.error("Lỗi khi tải danh sách mã giảm giá");
                setLoading(false);
            });
    };


    useEffect(() => {
        fetchCoupons();
    }, []);

    const onAdd = () => {
        setForm(emptyForm);
        setShowForm(true);
    };

    const onCancel = () => {
        setShowForm(false);
        setForm(emptyForm);
    };

    const onSubmit = async () => {
        if (form.discountPercent <= 0 || form.discountPercent > 100) {
            toast.error("Phần trăm giảm giá phải trong khoảng 1-100");
            return;
        }
        if (form.expiryDate === '') {
            toast.error("Ngày hết hạn không được để trống");
            return;
        }
        await createCoupon(quantity, form.discountPercent, new Date(form.expiryDate));
        setShowForm(false);
        setForm(emptyForm);
        fetchCoupons(1);
    };

    const onDelete = async (id) => {
        await deleteCoupon(id);
        fetchCoupons(currentPage);
    };

    const handlePageChange = (event, value) => {
        fetchCoupons(value);
    };

    if (loading) {
        return (
            <div className='container-book container mb-5 py-5 px-5 bg-light'>
                <div className='row'>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className='col-md-6 col-lg-3 mt-3'>
                            <Skeleton
                                className='my-3'
                                variant='rectangular'
                                height={400}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Danh sách mã giảm giá</h2>

            <Button
                variant="contained"
                color="primary"
                onClick={onAdd}
                style={{ marginTop: '20px', marginBottom: '20px' }}
            >
                Thêm mã giảm giá
            </Button>

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell><strong>Mã</strong></TableCell>
                            <TableCell align="center"><strong>Giảm giá (%)</strong></TableCell>
                            <TableCell><strong>Ngày hết hạn</strong></TableCell>
                            <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                            <TableCell align="center"><strong>Hành động</strong></TableCell>
                            <TableCell align="center"><strong>Kích hoạt</strong></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {coupons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Không có mã giảm giá nào</TableCell>
                            </TableRow>
                        ) : (
                            coupons.map((coupon) => (
                                <TableRow key={coupon.idCoupon}>
                                    <TableCell>{coupon.code}</TableCell>
                                    <TableCell align="center">{coupon.discountPercent}%</TableCell>
                                    <TableCell>{new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell align="center">
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: coupon.isUsed ? '#ffebee' : '#e8f5e9',
                                            color: coupon.isUsed ? '#c62828' : '#2e7d32'
                                        }}>
                                            {coupon.isUsed ? 'Đã sử dụng' : 'Chưa sử dụng'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => onDelete(coupon.idCoupon)}
                                            style={{ marginTop: '20px' }}
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={() => updateActiveCoupon(coupon.idCoupon, !coupon.isActive).then(() => fetchCoupons())}
                                            style={{ marginTop: '20px' }}
                                        >
                                            {coupon.isActive ? 'Hủy kích hoạt' : 'Kích hoạt'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" marginTop={3}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}

            <Dialog open={showForm} onClose={onCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Tạo mã giảm giá</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        <TextField
                            label="Số lượng mã giảm giá"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            fullWidth
                        />
                        <TextField
                            label="Phần trăm giảm giá (%)"
                            type="number"
                            value={form.discountPercent}
                            onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })}
                            inputProps={{ min: 1, max: 100 }}
                            fullWidth
                        />
                        <TextField
                            label="Ngày hết hạn"
                            type="date"
                            value={form.expiryDate}
                            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button onClick={onSubmit} variant="contained" color="primary">Tạo</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const CouponManagementPage = RequireAdmin(CouponManagement);
export default CouponManagementPage;
