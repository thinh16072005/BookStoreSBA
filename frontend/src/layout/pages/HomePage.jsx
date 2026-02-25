import React from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import BookList from "../products/BookList";
import HotBookList from "../products/HotBookList";
import NewBookList from "../products/NewBookList";
import Banner from "./components/banner/Banner";
import Carousel from "./components/carousel/Carousel";



const HomePage = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	return (
		<>
			<div className='d-md-none d-sm-none d-lg-block'>
				{/* Banner */}
				<Banner />
				{/* Underline */}
				<div className='d-flex justify-content-center align-items-center pb-4'>
					<hr className='w-100 mx-5' />
				</div>
			</div>
			{/* Slide img */}
			<div className='container'>
				<Carousel />
			</div>
			{/* Hot Product */}
			<HotBookList />
			{/* New Product */}
			<NewBookList />
			{/* Product List */}
			<BookList />
		</>
	);
};

export default HomePage;
