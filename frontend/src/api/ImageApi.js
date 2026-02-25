import ImageModel from "../model/ImageModel";
import { my_request } from "./Request";
import { endpointBE } from "../layout/utils/Constant";

async function getImage(endpoint) {
    const response = await my_request(endpoint)
    const responseData = response._embedded.images;
    const data = responseData.map((image) =>
        new ImageModel(
            image.idImage,
            image.nameImage,
            image.thumbnail,
            image.urlImage,
            image.dataImage)
    )
    console.log(data);
    return data;
}

export async function getAllImageByBook(idBook) {
    const endpoint = endpointBE + `/books/${idBook}/listImages`;
    return getImage(endpoint);
}
