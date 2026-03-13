import { DataGrid } from "@mui/x-data-grid";
import React from "react";

export const DataTable = (props) => {
	return (
		<div
			style={{
				width: "100%",
				height: props.rows.length > 0 ? "auto" : "200px",
			}}
		>
			<DataGrid
				rows={props.rows}
				columns={props.columns}
				{...props.other}
				hideFooter={props.hideFooter}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 10 },
					},
				}}
				pageSizeOptions={[10, 15, 20, 30]}
			/>
		</div>
	);
};
