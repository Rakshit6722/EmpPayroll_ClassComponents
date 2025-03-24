import React, { Component } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { withRouter } from '../utils/withRouter';
import logo from '../assets/logo.jpeg';

type HeaderProps = {
    navigate: NavigateFunction;
    container?: string;
};

class Header extends Component<HeaderProps> {
    handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('credential');

        this.props.navigate('/');
    };

    render() {
        const { container } = this.props;

        return (
            <div className="w-full h-16 bg-white flex justify-between items-center px-6 shadow-md">
                <div className="flex gap-2 items-center">
                    <img className="w-10 h-10" src={logo} alt="logo" />
                    <div>
                        <p className="font-bold text-[#82A70C]">EMPLOYEE</p>
                        <p className="text-[#42515F]">PAYROLL</p>
                    </div>
                </div>

                {container !== "login" && (
                    <button
                        onClick={this.handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        );
    }
}

export default withRouter(Header);
