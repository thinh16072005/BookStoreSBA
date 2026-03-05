import { endpointBE } from "../layout/utils/Constant";
import OrderModel from "../model/OrderModel";
import { my_request } from "./Request";

const getToken = () => localStorage.getItem("token") || "";

async function getPayment(idOrder) {
   try {
      const response = await my_request(endpointBE + `/orders/${idOrder}/payment`);
      return response.namePayment || "";
   } catch (error) {
      console.warn(`Failed to fetch payment for order ${idOrder}:`, error);
      return "";
   }
}

async function getDelivery(idOrder) {
   try {
      const response = await my_request(endpointBE + `/orders/${idOrder}/delivery`);
      return response.nameDelivery || "";
   } catch (error) {
      console.warn(`Failed to fetch delivery for order ${idOrder}:`, error);
      return "";
   }
}

export async function getOrders(page = 0, size = 10, sort = "idOrder,desc") {
   const url = `${endpointBE}/orders?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`;
   const token = getToken();
   const headers = {};
   if (token) headers.Authorization = `Bearer ${token}`;
   const data = await my_request(url, { headers });

   const items = await Promise.all(
      (data._embedded?.orders || []).map(async (o) => {
          const namePayment = await getPayment(o.idOrder);
          const nameDelivery = await getDelivery(o.idOrder);
          return new OrderModel(
              o.idOrder,
              o.deliveryAddress,
              o.totalPrice,
              o.totalPriceProduct,
              o.feeDelivery,
              o.feePayment,
              o.dateCreated,
              o.status,
              o.paymentStatus,
              o.user,
              o.fullName,
              o.phoneNumber,
              o.note,
              namePayment,
              nameDelivery
          );
      })
  );

   const pageInfo = data.page || { number: page, size, totalElements: items.length, totalPages: 1 };
   return { items, page: pageInfo };
}

export async function getOrderById(idOrder) {
    const url = `${endpointBE}/orders/${idOrder}`;
    const token = getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const o = await my_request(url, { headers });
    const responsePayment = await my_request(endpointBE + `/orders/${o.idOrder}/payment`);
    const responseDelivery = await my_request(endpointBE + `/orders/${o.idOrder}/delivery`);
    return new OrderModel(
        o.idOrder,
        o.deliveryAddress,
        o.totalPrice,
        o.totalPriceProduct,
        o.feeDelivery,
        o.feePayment,
        o.dateCreated,
        o.status,
        o.paymentStatus,
        o.user,
        o.fullName,
        o.phoneNumber,
        o.note,
        responsePayment.namePayment,
        responseDelivery.nameDelivery
    );
}

export async function updateOrderStatus(idOrder, status) {
   const url = `${endpointBE}/orders/${idOrder}`;
   const token = getToken();
   const res = await fetch(url, {
      method: "PATCH",
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
   });
   if (!res.ok) {
      throw new Error("Cập nhật trạng thái thất bại");
   }
}

export const getAllOrdersByIdUser = async (idUser) => {
   const endpoint = endpointBE + `/users/${idUser}/listOrders`;
   const response = await my_request(endpoint);
   const orders = await Promise.all(response._embedded.orders.map(async (order) => {
       const responsePayment = await my_request(endpointBE + `/orders/${order.idOrder}/payment`);
       const responseDelivery = await my_request(endpointBE + `/orders/${order.idOrder}/delivery`);
       return new OrderModel(
           order.idOrder,
           order.deliveryAddress,
           order.totalPrice,
           order.totalPriceProduct,
           order.feeDelivery,
           order.feePayment,
           order.dateCreated,
           order.status,
           order.paymentStatus,
           order.user,
           order.fullName,
           order.phoneNumber,
           order.note,
           responsePayment.namePayment,
           responseDelivery.nameDelivery
       );
   }));
   return orders;
};

export const get1Order = async (idOrder) => {
   const endpoint = endpointBE + `/orders/${idOrder}`;
   const response = await my_request(endpoint);
   const responsePayment = await my_request(endpointBE + `/orders/${idOrder}/payment`);
   const responseDelivery = await my_request(endpointBE + `/orders/${idOrder}/delivery`);
   const order = new OrderModel(
       response.idOrder,
       response.deliveryAddress,
       response.totalPrice,
       response.totalPriceProduct,
       response.feeDelivery,
       response.feePayment,
       response.dateCreated,
       response.status,
       response.paymentStatus,
       response.user,
       response.fullName,
       response.phoneNumber,
       response.note,
       responsePayment.namePayment,
       responseDelivery.nameDelivery
   );
   console.log(order);
   return order;
};

export const cancel1Order = async (order) => {
    const token = localStorage.getItem("token");
    const endpoint = endpointBE + "/order/update-order";
    const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order)
    });
    if (!response.ok) {
        throw new Error("Hủy đơn hàng thất bại");
    }
    return response.json();
};

export async function getAllOrders() {
    try {
        const result = await getOrders(0, 1000);
        return result.items;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
}
