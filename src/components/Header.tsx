import React, { Component } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { withRouter } from '../utils/withRouter';
import logo from '../assets/logo.jpeg';
import { FaRegUser, FaSignOutAlt } from "react-icons/fa";

type HeaderProps = {
    navigate: NavigateFunction;
    container?: string;
};

interface HeaderState {
    profileName: string;
    isProfileDropdownOpen: boolean;
}

class Header extends Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props)
    
        this.state = {
            profileName: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string)?.given_name : "",
            isProfileDropdownOpen: false
        }
    }

    handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('credential');

        this.props.navigate('/');
    };

    toggleProfileDropdown = () => {
        this.setState(prevState => ({
            isProfileDropdownOpen: !prevState.isProfileDropdownOpen
        }));
    };

    render() {
        const { container } = this.props;
        const { profileName, isProfileDropdownOpen } = this.state;

        return (
            <div className="w-full py-4 bg-white flex justify-between items-center px-8 p shadow-md">
                <div className="flex gap-2 items-center">
                    <img className="w-10 h-10" src={logo} alt="logo" />
                    <div>
                        <p className="font-bold text-[#82A70C]">EMPLOYEE</p>
                        <p className="text-[#42515F]">PAYROLL</p>
                    </div>
                </div>

                {container !== 'login' && (
                    <div className="relative">
                        <button 
                            onClick={this.toggleProfileDropdown}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
                        >
                            <div className="w-8 h-8 bg-[#82A70C] text-white rounded-full flex items-center justify-center">
                                {profileName ? profileName.charAt(0).toUpperCase() : <FaRegUser />}
                            </div>
                            <p className="text-[#42515F] font-medium">{profileName}</p>
                        </button>

                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                                <button
                                    onClick={this.handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 transition text-red-600"
                                >
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(Header);