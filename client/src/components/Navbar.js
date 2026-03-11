import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LocationSearch from "./LocationSearch";

function Navbar({ filterByLocation, searchService }) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);

    function logout() {
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
    }

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (searchService) {
            searchService(term);
        }
    };

    const handleLocationSelect = (location) => {
        if (filterByLocation) {
            filterByLocation(location.display_name);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsDropdownOpen(false); // Close dropdown when menu toggles
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close mobile menu when clicking outside
            if (menuRef.current && !menuRef.current.contains(event.target) && 
                !event.target.closest('.navbar-toggler')) {
                setIsMenuOpen(false);
            }
            
            // Close dropdown when clicking outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check user roles for navigation items
    const isVendor = user?.role === 'vendor' || user?.isVendor;
    const isAdmin = user?.role === 'admin' || user?.isAdmin;
    
    // Super Admin only for specific email
    const isSuperAdmin = user?.email === 'himanshufa875@gmail.com' && 
                         (user?.role === 'superadmin' || user?.isAdmin);

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            <div className="container-fluid">
                {/* Brand Section */}
                <div className="navbar-brand-section">
                    <a className="navbar-brand" href="/home" onClick={(e) => {
                        e.preventDefault();
                        handleNavigation('/home');
                    }}>
                        <h5 className="app-title">Service Hunt</h5>
                    </a>
                    <button
                        className="navbar-toggler custom-toggler"
                        type="button"
                        onClick={toggleMenu}
                        aria-controls="navbarNav"
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <i className="fa fa-bars"></i>
                    </button>
                </div>

                {/* Navigation Links */}
                <div 
                    ref={menuRef}
                    className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`} 
                    id="navbarNav"
                >
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                {/* Search Bar - Visible for logged in users */}
                                {/* <li className="nav-item search-container">
                                    <div className="nav-search">
                                        <input
                                            type="text"
                                            className="search-input"
                                            placeholder="Search services..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        <i className="fa fa-search search-icon"></i>
                                    </div>
                                </li> */}

                                {/* Location Search */}
                                {/* <li className="nav-item location-container">
                                    <LocationSearch onLocationSelect={handleLocationSelect} />
                                </li> */}

                                {/* Post Requirement */}
                                {/* <li className="nav-item post-requirement">
                                    <button
                                        className="nav-link btn-post-requirement"
                                        onClick={() => handleNavigation("/post-requirement")}
                                    >
                                        <i className="fa fa-plus-circle"></i>
                                        <span className="btn-text">Post Requirement</span>
                                    </button>
                                </li> */}

                                {/* User Menu */}
                                <li className="nav-item dropdown user-menu" ref={dropdownRef}>
                                    <div className="user-dropdown">
                                        <button
                                            className="user-toggle"
                                            type="button"
                                            onClick={toggleDropdown}
                                            aria-expanded={isDropdownOpen}
                                        >
                                            <i className="fa fa-user"></i>
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-initials" style={{ textAlign:"center"}}> 
                                                {user.name}
                                            </span>
                                        </button>
                                        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                                            <button className="dropdown-item" onClick={() => handleNavigation("/profile")}>
                                                <i className="fa fa-user-o"></i> Profile
                                            </button>
                                            <button className="dropdown-item" onClick={() => handleNavigation("/myorders")}>
                                                <i className="fa fa-gavel"></i>Orders
                                            </button>
                                            <button className="dropdown-item" onClick={() => handleNavigation("/form")}>
                                                <i className="fa fa-handshake-o"></i> Partner
                                            </button>
                                            
                                            {/* Vendor Dashboard */}
                                            {isVendor && (
                                                <button className="dropdown-item" onClick={() => handleNavigation("/vendor-dashboard")}>
                                                    <i className="fa fa-dashboard"></i> Vendor Dashboard
                                                </button>
                                            )}
                                            
                                            {/* Admin Panel */}
                                            {isAdmin && !isVendor && (
                                                <button className="dropdown-item" onClick={() => handleNavigation("/adminscreen")}>
                                                    <i className="fa fa-shield"></i> Admin Panel
                                                </button>
                                            )}
                                            
                                            {/* Super Admin - Only for specific email */}
                                            {isSuperAdmin && (
                                                <button className="dropdown-item" onClick={() => handleNavigation("/superadmin")}>
                                                    <i className="fa fa-star"></i> Super Admin
                                                </button>
                                            )}
                                            
                                            <button className="dropdown-item" onClick={() => handleNavigation("/about")}>
                                                <i className="fa fa-info-circle"></i> About
                                            </button>
                                            <button className="dropdown-item" onClick={() => handleNavigation("/helperpanel")}>
                                                <i className="fa fa-life-ring"></i> Helper Panel
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item" onClick={logout}>
                                                <i className="fa fa-sign-out"></i> Logout
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </>
                        ) : (
                            /* Guest User Links */
                            <>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn-register"
                                        onClick={() => handleNavigation("/register")}
                                        style={{color:"black"}}
                                    >
                                        Register
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="nav-link btn-login"
                                        onClick={() => handleNavigation("/login")}
                                    >
                                        Login
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;