import React, { useEffect, useState } from "react";
import UserModel from "../../../../model/UserModel";
import { getUserByIdReview } from "../../../../api/UserApi";

const User = (props) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		getUserByIdReview(props.idReview).then((response) => {
			setUser(response);
		});
	}, []);

	return (
		<>
			<div className='me-4 mt-1'>
				<img
					src={user?.avatar}
					alt="avatar"
					style={{
						width: '50px',
						height: '50px',
						borderRadius: '50%',
						objectFit: 'cover',
						border: '2px solid #e0e0e0'
					}}
				/>
			</div>
			<div>
				<strong>{user?.username}</strong>
			</div>
			{props.children}
		</>
	);
};

export default User;
