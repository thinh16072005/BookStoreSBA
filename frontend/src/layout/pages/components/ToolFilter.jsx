import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import GenreModel from "../../../model/GenreModel";
import { getAllGenres } from "../../../api/GenreApi";
import { TextField } from "@mui/material";

const ToolFilter = (props) => {

	//Tạo biến để lưu trữ giá trị tìm kiếm
	const [keySearchTemp, setKeySearchTemp] = useState(props.keySearch ?? "");


	// Lấy tất cả thể loại ra
	const [genres, setGenres] = useState(null);
	useEffect(() => {
		getAllGenres()
			.then((response) => {
				setGenres(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	//Xử lý khi chọn thể loại
	const handleChangeGenre = (event) => {

		const value = event.target.value;
		const selected = value === "" ? undefined : Number(value);

		// Gọi callback lên Parent
		props.onGenreChange(selected);

	};

	//Xử lý khi nhập tên sách
	const handleChangeKeySearch = (event) => {
		const value = event.currentTarget.value;
		setKeySearchTemp(value);
	}

	//Xử lý khi click vào nút tìm kiếm
	const handleClickSearch = (event) => {
		props.onKeySearchChange(keySearchTemp);
	}

	return (
		<div className='d-flex align-items-center justify-content-between'>
			<div className='row' style={{ flex: 1 }}>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-sm-center'>
						{/* Genre */}
						<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
							<InputLabel id='demo-simple-select-helper-label'>
								Thể loại sách
							</InputLabel>
							{/* Vì Select yêu cầu value mang giá trị là String nên phải parse qua String  */}
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={String(props.genreId ?? "")}
								label='Thể loại sách'
								autoWidth
								onChange={handleChangeGenre}
								sx={{ minWidth: "150px" }}
							>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								{genres?.map((genre, index) => {
									return (
										<MenuItem value={String(genre.idGenre)} key={index}>
											{genre.nameGenre}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
						{/* Search */}
						<div className='col-lg-6 col-md-12 col-sm-12'>
							<div className='d-inline-flex align-items-center justify-content-lg-end w-100 justify-content-md-center'>
								<div className='d-inline-flex align-items-center justify-content-between mx-5'>
									<TextField
										size='small'
										id='outlined-search'
										label='Tìm kiếm theo tên sách'
										type='search'
										value={keySearchTemp}
										onChange={handleChangeKeySearch}
									/>
									<button
										style={{ height: "40px" }}
										type='button'
										className='btn btn-primary ms-2'
										onClick={handleClickSearch}
									>
										<i className='fas fa-search'></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

export default ToolFilter;
