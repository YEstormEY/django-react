import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import { ACCESS_TOKEN } from "../constants";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN); // Change if you use a different auth system

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">NotesApp</Link>
                <ul className="nav-links">
                    <li>
                        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
                    </li>
                    {!isAuthenticated && (
                        <>
                            <li>
                                <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
                            </li>
                            <li>
                                <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
                            </li>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <li>
                                <Link to="/account/" className={location.pathname === "/account/" ? "active" : ""}>Account</Link>
                            </li>
                            <li>
                                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
