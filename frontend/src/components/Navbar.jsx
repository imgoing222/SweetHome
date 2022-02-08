import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSignOutAlt,
	faUser,
	faEnvelope,
	faBars,
	faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_TOGGLE } from "../store/toggle";
import style from "../style/Navbar.module.css";

function Navbar() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.userInfo.username);
	const toggle = useSelector((state) => state.toggle.toggleValue);
	const position = useSelector((state) => state.toggle.position);

	const logOut = () => {
		console.log("temp");
	};

	const toggleMenu = () => {
		dispatch(SET_TOGGLE(toggle, position));
	};

	return (
		<nav className={style.navbar_main}>
			{user && (
				<div className={style.navbar_container}>
					<div className={style.toggle_container}>
						<FontAwesomeIcon className={style.icon} onClick={toggleMenu} icon={faBars} />
						<Link className={style.main_home} to="/main">
							SweetHome
							<FontAwesomeIcon className={style.icon} icon={faHome} />
						</Link>
					</div>
					<div className={style.icon_container}>
						<Link to="/message-box/">
							<FontAwesomeIcon className={style.icon} icon={faEnvelope} />
						</Link>
						<Link to={`/profile/${user}`}>
							<FontAwesomeIcon className={style.icon} icon={faUser} />
						</Link>
						<FontAwesomeIcon className={style.icon} icon={faSignOutAlt} onClick={logOut} />
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navbar;
