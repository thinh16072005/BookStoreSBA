import { toast } from "react-toastify";
import { endpointBE } from "../layout/utils/Constant";
import { getIdUserByToken } from "../layout/utils/JwtService";
import CartItemModel from "../model/CartItemModel";
import { getBookByIdCartItem } from "./BookApi";
import { my_request } from "./Request";

// Lấy giỏ hàng theo id user
export async function getCartAllByIdUser() {
   const idUser = Number(getIdUserByToken());
   const endpoint = endpointBE + `/users/${idUser}/listCartItems`;
   try {
      const response = await my_request(endpoint);
      const responseData = response._embedded.cartItems;
      const cartResponseList = await Promise.all(responseData.map(async (item) => {
         const book = await getBookByIdCartItem(item.idCart);
         return new CartItemModel(item.idCart, item.quantity, book || undefined, idUser);
      })
      );
      console.log(cartResponseList);
      return cartResponseList;
   } catch (error) {
      console.error('Error: ', error);
   }
   return [];
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
export async function updateQuantityCartItem(cartItem) {
   const endpoint = endpointBE + `/cart-item/update-quantity/${cartItem.idCart}`;
   const token = localStorage.getItem('token');
   try {
      const response = await my_request(endpoint, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
         body: JSON.stringify({
            quantity: cartItem.quantity,
         }),
      });
      if (response) {
         toast.success("Đã cập nhật số lượng sản phẩm trong giỏ hàng");
      }
   } catch (error) {
      console.error('Error: ', error);
   }
}
