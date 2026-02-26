import { endpointBE } from "../layout/utils/Constant";
import { my_request } from "./Request";

export async function getFavoriteBooksByUser(idUser) {
    const endpoint = `${endpointBE}/favorite-book/get-favorite-book/${idUser}`;
    const response = await my_request(endpoint);
    return response;
}

export async function addFavoriteBook(idUser, idBook) {
    const endpoint = `${endpointBE}/favorite-book/add-book`;
    const requestBody = {
        idUser: idUser,
        idBook: idBook
    };
    const response = await my_request(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    return response;
}

export async function removeFavoriteBook(idUser, idBook) {
    const endpoint = `${endpointBE}/favorite-book/remove-book`;
    const requestBody = {
        idUser: idUser,
        idBook: idBook
    };
    const response = await my_request(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    return response;
}
