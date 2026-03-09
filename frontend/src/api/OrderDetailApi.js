import { endpointBE } from "../layout/utils/Constant";
import OrderDetail from "../model/OrderDetail";
import { my_request } from "./Request";

export const get1OrderDetail = async (idOrder) => {
    const endpoint = endpointBE + `/orders/${idOrder}/listOrderDetails`;
    const response = await my_request(endpoint);
    const responseData = response._embedded.orderDetails;
    const orderDetail = await Promise.all(responseData.map((orderDetail) =>
        new OrderDetail(
            orderDetail.idOrderDetail,
            orderDetail.quantity,
            orderDetail.price,
            orderDetail.review,
        )
    ));
    console.log(orderDetail);
    return orderDetail;
}
