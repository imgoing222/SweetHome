import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function AdminBoardList() {
	const [boardList, setBoardList] = useState({
		id: "",
		name: "",
		description: "",
	});

	useEffect(() => {
		axios({
			method: "GET",
			url: `${SERVER_URL}/api/boards`,
		})
			.then((res) => {
				console.log(res.data);
				setBoardList(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const onDelete = (e) => {
		const id = e.target.id;
		axios({
			method: "DELETE",
			url: `${SERVER_URL}/api/admin/boards/${id}`,
		})
			.then((res) => {
				console.log("성공");
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<table>
			<thead>
				<tr>
					<th>이름</th>
					<th>설명</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{boardList.length > 0 ? (
					boardList.map((board, idx) => (
						<tr key={idx}>
							<td>{board.name}</td>
							<td>{board.description}</td>
							<td>
								<Link to="board-update" state={{ board: board }}>
									수정
								</Link>
							</td>
							<td>
								<button id={board.id} onClick={onDelete}>
									삭제
								</button>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan="4">게시판이 없습니다</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default AdminBoardList;
