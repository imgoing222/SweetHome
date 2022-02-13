import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faBan } from "@fortawesome/free-solid-svg-icons";
import * as inputValid from "utils/inputValid";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileButtons from "./ProfileButtons";
import style from "style/Profile.module.css";
import { isThisDuplicte } from "utils/accountAxios";
import { useSelector } from "react-redux";

function ProfileUserInfo({ setIntro, intro }) {
	const SERVER_URL = process.env.REACT_APP_SERVER_URL;
	const user = useSelector((state) => state.userInfo);
	const [isDup, setIsDup] = useState(0);
	const [userInfo, setUserInfo] = useState({
		username: "",
		email: "",
		phone_number: "",
		authority: "",
		apt_house: {},
		password: "",
		image_url: "",
	});
	const profileImage = useRef(null);
	const [imgFile, setFiles] = useState(null);

	useEffect(() => {
		setUserInfo(user);
	}, []);

	const { username, email, phone_number, image_url, apt_house, password } = userInfo;

	const isValid = inputValid.profileChange(email, phone_number);

	const onChange = (e) => {
		setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
	};

	const checkUserDup = () => {
		const data = { value: username };
		if (username === user.username) {
			return setIsDup(2);
		}
		isThisDuplicte("name", data, setIsDup);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (isDup === 2 && isValid && username.trim().length > 0) {
			const formData = new FormData();
			const data = { email, password, username, phone_number };
			formData.append("image", imgFile);
			formData.append("profile", new Blob([JSON.stringify(data)], { type: "application/json" }));
			axios({
				method: "put",
				url: `${SERVER_URL}/api/members/my-profile`,
				data: formData,
			})
				.then(setUserInfo({ ...userInfo, password: "" }))
				.then(() => toast.success("회원정보가 변경 되었습니다"))
				.catch((err) => console.log(err.response.data));

			setIntro({
				...intro,
				email: userInfo.email,
				username: userInfo.username,
			});
			setIsDup(0);
			window.location.reload();
		} else {
			toast.error("회원 정보가 변경 되지 않았습니다.");
		}
	};
	return (
		userInfo.username && (
			<>
				<div className={style.profile_user}>
					<figure className={style.figure}>
						<input
							ref={profileImage}
							className={style.input_image}
							type="file"
							accept="image/*"
							onChange={(e) => setFiles(e.target.files[0])}
						/>
						<img
							src={image_url}
							alt="Profile img"
							className={style.profile_img}
							onClick={() => profileImage.current.click()}
						/>
					</figure>
					<div>
						<h1 className={style.title}>{intro.username}</h1>
						<p className={style.email}>{intro.email}</p>
					</div>
				</div>
				<form onSubmit={onSubmit} className={style.profile_form}>
					<div className={style.profile_user_info_div}>
						<aside>
							<label htmlFor="username">닉네임</label>
						</aside>
						<div className={style.user_name}>
							<input
								type="text"
								id="username"
								value={username || ""}
								onChange={onChange}
								onBlur={checkUserDup}
							/>
							{(isDup === 1 && <FontAwesomeIcon icon={faBan} className={style.iconDuplicate} />) ||
								(isDup === 2 && <FontAwesomeIcon icon={faCheck} className={style.notDupl} />)}
						</div>
					</div>
					<div className={style.profile_user_info_div}>
						<aside>
							<label htmlFor="email">Email</label>
						</aside>
						<input type="text" id="email" value={email || ""} onChange={onChange} />
					</div>
					<div className={style.profile_user_info_div}>
						<aside>
							<label htmlFor="phone_number">휴대폰 번호</label>
						</aside>
						<input type="text" id="phone_number" value={phone_number || ""} onChange={onChange} />
					</div>
					{apt_house && (
						<div className={style.profile_user_info_div}>
							<aside>
								<label htmlFor="apt_house">주소</label>
							</aside>
							<input type="text" readOnly id="apt_house" value={apt_house.apt.road_Name || ""} />
						</div>
					)}

					<div className={style.profile_user_info_div}>
						<aside>
							<label htmlFor="password">비밀번호</label>
						</aside>
						<input type="password" id="password" value={password || ""} onChange={onChange} />
					</div>

					<ProfileButtons password={password} isDup={isDup} />
				</form>
			</>
		)
	);
}

export default ProfileUserInfo;
