import { endpointBE } from "../layout/utils/Constant";
import ReviewModel from "../model/ReviewModel";
import { my_request } from "./Request";

async function getReview(endPoint) {
    const response = await my_request(endPoint);
    const responseData = response._embedded.reviews;
    const reviewList = responseData.map((review) => {
        return new ReviewModel(
            review.idReview,
            review.content,
            review.ratingPoint,
            review.timestamp
        );
    });
    return reviewList;
}

export function getReviewByIdBook(idBook) {
    const endPoint = endpointBE + `/books/${idBook}/listReviews`;
    return getReview(endPoint);
}

export async function getTotalNumberOfReviews() {
    try {
        const endPoint = endpointBE + "/reviews?size=1";
        const response = await my_request(endPoint);
        return response.page?.totalElements || 0;
    } catch (error) {
        console.error("Error fetching total number of reviews:", error);
        return 0;
    }
}
