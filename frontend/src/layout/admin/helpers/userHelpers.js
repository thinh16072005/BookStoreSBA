import { endpointBE } from "../../utils/Constant";
import { my_request } from "../../../api/Request";
import UserModel from "../../../model/UserModel";

// Hàm lấy tất cả user (đơn giản) từ Spring Data REST /users
export async function getAllUsers() {
    const endpoint = `${endpointBE}/users?sort=idUser`;
    const response = await my_request(endpoint); // gọi fetch GET
    const responseData = response._embedded?.users || [];
    const list = responseData.map((u) => new UserModel(
        u.idUser,
        u.dateOfBirth,
        u.deliveryAddress,
        u.email,
        u.firstName,
        u.lastName,
        u.gender,
        u.password,
        u.phoneNumber,
        u.username,
        u.avatar,
        u.enabled
    ));
    return list;
}

// Hàm lấy danh sách user có phân trang từ Spring Data REST /users
// Trả về mảng UserModel cùng metadata phân trang
export async function getUsers(page = 0, size = 10, sort = "idUser,asc") {
    const url = `${endpointBE}/users?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`;
    const token = localStorage.getItem("token") || "";
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const data = await my_request(url, {
        headers,
    });

    const items = (data._embedded?.users || []).map((u) => new UserModel(
        u.idUser,
        u.dateOfBirth,
        u.deliveryAddress,
        u.email,
        u.firstName,
        u.lastName,
        u.gender,
        u.password,
        u.phoneNumber,
        u.username,
        u.avatar,
        u.enabled
    ));

    const pageInfo = data.page || { number: page, size, totalElements: items.length, totalPages: 1 };
    return { items, page: pageInfo };
}

