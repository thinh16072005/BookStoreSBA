import { endpointBE } from "../layout/utils/Constant";
import FeedbackModel from "../model/FeedbackModel";
import { my_request } from "./Request";

async function getFeedback(endPoint) {
    const response = await my_request(endPoint);
    const responseData = response._embedded?.feedbacks || [];
    const feedbackList = responseData.map((feedback) => {
        const fb = new FeedbackModel();
        fb.idFeedback = feedback.idFeedback;
        fb.title = feedback.title;
        fb.comment = feedback.comment;
        fb.dateCreated = feedback.dateCreated;
        fb.readed = feedback.readed;
        fb.username = feedback.username;
        return fb;
    });
    return feedbackList;
}

export async function getAllFeedback() {
    const endPoint = endpointBE + "/feedbacks";
    return getFeedback(endPoint);
}

export async function getTotalNumberOfFeedbacks() {
    try {
        const endPoint = endpointBE + "/feedbacks";
        const response = await my_request(endPoint);
        const feedbacks = await Promise.all(response._embedded.feedbackses.map(async (feedback) => {
            const fb = new FeedbackModel();
            fb.idFeedback = feedback.idFeedback;
            fb.title = feedback.title;
            fb.comment = feedback.comment;
            fb.dateCreated = feedback.dateCreated;
            fb.readed = feedback.readed;
            fb.username = feedback.username;
        }));
       console.log(feedbacks.length);
       return feedbacks.length;
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return 0;
    }
}

export async function getUnreadFeedbackCount() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            return 0;
        }
        const response = await fetch(endpointBE + "/api/admin/feedback/unread-count", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const count = await response.json();
            return count;
        } else {
            console.error("Error fetching unread feedback count:", response.statusText);
            return 0;
        }
    } catch (error) {
        console.error("Error fetching unread feedback count:", error);
        return 0;
    }
}

export async function getUnreadFeedbacks() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return [];
        const response = await fetch(endpointBE + "/api/admin/feedback?page=0&size=100", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) return [];
        const responseData = await response.json();
        const unreadFeedbacks = responseData.content
            .filter((feedback) => {
                const v = feedback.isReaded;
                if (v === false) return true;
                if (v === "false") return true;
                return false;
            })
            .map((feedback) => {
                const fb = new FeedbackModel();
                fb.idFeedback = feedback.idFeedback;
                fb.title = feedback.title;
                fb.comment = feedback.comment;
                fb.dateCreated = feedback.dateCreated;
                fb.readed = feedback.isReaded;
                fb.username = feedback.username;
                return fb;
            });
        return unreadFeedbacks;
    } catch (e) {
        console.error("Error getUnreadFeedbacks:", e);
        return [];
    }
}
