import React, { useEffect, useMemo, useState } from 'react';
import GenreModel from "../../model/GenreModel";
import { endpointBE } from "../utils/Constant";
import { getAllGenres } from "../../api/GenreApi";
import { getBookCountByGenreId } from "../../api/BookApi";
import RequireAdmin from "./RequireAdmin";
import { toast } from "react-toastify";

// Hàm lấy token từ localStorage để gửi kèm trong request
const getToken = () => localStorage.getItem("token");
// Trang quản lý thể loại: danh sách, thêm, sửa, xóa (CRUD cơ bản)

const emptyForm = { nameGenre: "" };

const GenreManagement = () => {
    const [genres, setGenres] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // trạng thái hiển thị form

    const loadGenres = async () => {
        setLoading(true);
        try {
            const list = await getAllGenres(); // dùng sẵn API GET
            setGenres(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadGenres(); }, []);

    const filtered = useMemo(() => {
        if (!keyword.trim()) return genres;
        const k = keyword.toLowerCase();
        return genres.filter(g => (g.nameGenre || '').toLowerCase().includes(k));
    }, [genres, keyword]);

    // Chọn thể loại để sửa: nạp dữ liệu và hiển thị form
    const onEdit = (g) => {
        setForm({ idGenre: g.idGenre, nameGenre: g.nameGenre });
        setShowForm(true); // hiển thị form để chỉnh sửa
    };

    // Bắt đầu thêm mới: reset form và hiển thị form
    const onAdd = () => {
        setForm(emptyForm); // reset form về rỗng
        setShowForm(true); // hiển thị form để điền thông tin
    };

    const onDelete = async (id) => {
        if (!window.confirm('Xóa thể loại này?')) return;

        try {
            // Kiểm tra xem genre có sách không
            const bookCount = await getBookCountByGenreId(id);

            if (bookCount > 0) {
                toast.error(`Không thể xóa thể loại này vì đang có ${bookCount} quyển sách sử dụng!`);
                return;
            }

            // Gửi request DELETE kèm token để backend xác thực quyền ADMIN
            const response = await fetch(`${endpointBE}/genre/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}` // Gửi token để xác thực quyền ADMIN
                }
            });

            if (response.ok || response.status === 204) {
                toast.success("Xóa thể loại thành công!");
                await loadGenres();
            } else {
                const errorText = await response.text();
                toast.error(errorText || "Xóa thể loại thất bại!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi khi xóa!");
        }
    };

    // Hủy form: ẩn form và reset
    const onCancel = () => {
        setShowForm(false); // ẩn form
        setForm(emptyForm); // reset form về rỗng
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra validation: tên thể loại không được rỗng
        if (!form.nameGenre.trim()) {
            toast.warning("Vui lòng nhập tên thể loại!");
            return;
        }

        try {
            if (!form.idGenre) {
                // Thêm mới: POST /genre - gửi kèm token để xác thực quyền ADMIN
                const response = await toast.promise(
                    fetch(`${endpointBE}/genre`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}` // Gửi token để xác thực quyền ADMIN
                        },
                        body: JSON.stringify({ nameGenre: form.nameGenre })
                    }),
                    { pending: "Đang thêm thể loại mới..." }
                );

                if (response.ok) {
                    toast.success("Thêm thể loại thành công!");
                    setForm(emptyForm);
                    setShowForm(false); // ẩn form sau khi thêm thành công
                    await loadGenres(); // tải lại danh sách
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    toast.error(errorData.message || "Thêm thể loại thất bại!");
                }
            } else {
                // Cập nhật: PUT /genre/{id} - gửi kèm token để xác thực quyền ADMIN
                const response = await toast.promise(
                    fetch(`${endpointBE}/genre/${form.idGenre}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${getToken()}` // Gửi token để xác thực quyền ADMIN
                        },
                        body: JSON.stringify({ nameGenre: form.nameGenre })
                    }),
                    { pending: "Đang cập nhật thể loại..." }
                );

                if (response.ok || response.status === 204) {
                    toast.success("Cập nhật thể loại thành công!");
                    setShowForm(false); // ẩn form sau khi cập nhật thành công
                    await loadGenres(); // tải lại danh sách
                } else {
                    toast.error("Cập nhật thể loại thất bại!");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Đã xảy ra lỗi trong quá trình xử lý!");
        }
    };

    return (
        <div className='container my-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <h3>Quản lý thể loại</h3>
                <div className='d-flex gap-2'>
                    <input className='form-control' placeholder='Tìm theo tên thể loại...'
                        value={keyword} onChange={(e)=>setKeyword(e.target.value)} style={{ width: 300 }} />
                    <button className='btn btn-success' onClick={onAdd}>+ Thêm thể loại</button>
                </div>
            </div>

            {/* Form thêm/sửa - chỉ hiển thị khi showForm = true */}
            {showForm && (
                <form onSubmit={onSubmit} className='card p-3 mb-4'>
                <div className='row g-3'>
                    <div className='col-md-6'>
                        <label className='form-label'>Tên thể loại</label>
                        <input className='form-control' value={form.nameGenre}
                            onChange={(e)=>setForm({...form, nameGenre: e.target.value})} required />
                    </div>
                </div>
                <div className='mt-3'>
                    <button className='btn btn-primary me-2' type='submit'>Xác nhận</button>
                    <button className='btn btn-secondary me-2' type='button' onClick={()=>setForm(emptyForm)}>Làm mới</button>
                    <button className='btn btn-outline-secondary' type='button' onClick={onCancel}>Hủy</button>
                </div>
            </form>
            )}

            <div className='card'>
                <div className='table-responsive'>
                    <table className='table table-striped align-middle'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên thể loại</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (<tr><td colSpan={3} className='text-center'>Đang tải...</td></tr>)}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={3} className='text-center'>Không có dữ liệu</td></tr>
                            )}
                            {!loading && filtered.map(g => (
                                <tr key={g.idGenre}>
                                    <td>{g.idGenre}</td>
                                    <td>{g.nameGenre}</td>
                                    <td>
                                        <button className='btn btn-sm btn-outline-primary me-2' onClick={()=>onEdit(g)}>Sửa</button>
                                        <button className='btn btn-sm btn-outline-danger' onClick={()=>onDelete(g.idGenre)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const GenreManagementPage = RequireAdmin(GenreManagement);
export default GenreManagementPage;
