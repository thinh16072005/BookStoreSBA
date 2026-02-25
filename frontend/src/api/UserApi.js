import { endpointBE } from "../layout/utils/Constant";
import UserModel from "../model/UserModel";
import { my_request } from "./Request";

async function getUser(endPoint) {
    const response = await my_request(endPoint);
    const responseData = response._embedded.users;
    const userList = responseData.map((user) => {
        return new UserModel(
            user.idUser,
            user.dateOfBirth,
            user.deliveryAddress,
            user.email,
            user.firstName,
            user.lastName,
            user.gender,
            user.password,
            user.phoneNumber,
            user.username,
            user.avatar,
            user.enabled
        );
    });
    return userList;
}

// Hàm lấy user theo id review
export async function getUserByIdReview(idReview) {
    const endPoint = endpointBE + `/reviews/${idReview}/user`;
    const response = await my_request(endPoint);

    const user = new UserModel(
        response.idUser,
        response.dateOfBirth,
        response.deliveryAddress,
        response.email,
        response.firstName,
        response.lastName,
        response.gender,
        response.password,
        response.phoneNumber,
        response.username,
        response.avatar,
        response.enabled
    );
    return user;
}

// Hàm lấy 1 user theo id
export async function get1User(idUser) {
    const endPoint = endpointBE + `/users/${idUser}`;
    const response = await my_request(endPoint);

    const user = new UserModel(
        response.idUser,
        response.dateOfBirth,
        response.deliveryAddress,
        response.email,
        response.firstName,
        response.lastName,
        response.gender,
        response.password,
        response.phoneNumber,
        response.username,
        response.avatar,
        response.enabled
    );
    return user;
}

// Hàm lấy tất cả user theo role
export async function getAllUserRole() {
    try {
        const endPoint = endpointBE + "/users?size=1000";
        return getUser(endPoint);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// Hàm upload avatar
export async function changeAvatar(idUser, avatarBase64) {
    const endpoint = endpointBE + `/user/change-avatar`;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                idUser: idUser,
                avatar: avatarBase64,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.notification || "Upload avatar thất bại");
        }

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
        }

        return data.token || "";
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
}
