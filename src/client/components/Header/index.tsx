import { NavLink } from "react-router-dom";
import React from "react";
import "./styles.scss";

const Header = () => {
    return (
        <ul>
            <li>
                <NavLink to="/" exact={true} activeClassName="active">
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink to="/why" activeClassName="active">
                    Why
                </NavLink>
            </li>
            <li>
                <NavLink to="/about" activeClassName="active">
                    About
                </NavLink>
            </li>
        </ul>
    );
};

export default Header;
