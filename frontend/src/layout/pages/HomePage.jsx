import React from 'react';
import useScrollToTop from "../../hooks/ScrollToTop";

const HomePage = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	return (
		<>
			<div>
				HomePage
			</div>
		</>
	);
};

export default HomePage;
