import { toast } from "react-toastify";
import { endpointBE } from "../layout/utils/Constant";
import Coupon from "../model/Coupon";

export async function getCoupon(page = 0, size = 10) {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + `/coupons?page=${page}&size=${size}&sort=discountPercent,desc&expiryDate,desc`;
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const responseData = await response.json();
        const couponList = await Promise.all(responseData._embedded.coupons.map(async (item) => {
            const coupon = new Coupon(item.idCoupon, item.code, item.discountPercent, item.expiryDate, item.isUsed, item.isActive);
            return coupon;
        }));
        console.log(couponList);
        return {
            coupons: couponList,
            totalPages: responseData.page.totalPages,
            totalElements: responseData.page.totalElements,
            currentPage: page
        };
    } catch (error) {
        console.error('Error: ', error);
    }
    return { coupons: [], totalPages: 0, totalElements: 0, currentPage: 0 };
}

export async function createCoupon(quantity, discountPercent, expiryDate) {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + `/coupon/create/${quantity}`;
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ discountPercent, expiryDate })
        });
        if (response.ok) {
            toast.success((await response.json()).message);
        } else {
            toast.error((await response.json()).message);
        }
    } catch (error) {
        toast.error("Xảy ra lỗi khi tạo mã giảm giá");
    }
}

export async function deleteCoupon(id) {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + `/coupon/delete/${id}`;
        const response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            toast.success((await response.json()).message);
        } else {
            toast.error((await response.json()).message);
        }
    } catch (error) {
        toast.error("Xảy ra lỗi khi xóa mã giảm giá");
    }
}

export async function updateActiveCoupon(id, isActive) {
    const endpoint = endpointBE + `/coupon/update/active/${id}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ isActive: isActive }),
        });
        if (response.ok) {
            toast.success((await response.json()).message);
        } else {
            toast.error((await response.json()).message);
        }
    } catch (error) {
        toast.error("Xảy ra lỗi khi cập nhật mã giảm giá");
    }
}

export async function getAllCoupons() {
    try {
        const token = localStorage.getItem('token');
        const endpoint = endpointBE + "/coupons?sort=discountPercent,desc&expiryDate,desc";
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const responseData = await response.json();
        const couponList = await Promise.all(responseData._embedded.coupons.map(async (item) => {
            const coupon = new Coupon(item.idCoupon, item.code, item.discountPercent, item.expiryDate, item.isUsed, item.isActive);
            return coupon;
        }));
        return couponList;
    } catch (error) {
        console.error('Error: ', error);
    }
    return [];
}

export async function updateUsedCoupon(code) {
    const endpoint = endpointBE + `/coupon/update/used?code=${code}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.ok) {
            console.log((await response.json()).message);
        } else {
            console.log((await response.json()).message);
        }
    } catch (error) {
        console.log("Xảy ra lỗi khi cập nhật mã giảm giá");
    }
}
