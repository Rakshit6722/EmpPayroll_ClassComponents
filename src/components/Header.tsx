import React, { Component } from 'react'
import logo from '../assets/logo.jpeg'

export class Header extends Component {
    render() {
        return (
            <div>
                <div className="w-full h-16 bg-white relative">
                    <div className="flex gap-1 mt-6 ml-[5%] items-center">
                        <img className="w-10 h-10" src={logo} alt="logo" />
                        <div className="no-underline">
                            <p className="font-bold text-[#82A70C]">EMPLOYEE</p>
                            <p className="text-[#42515F]">PAYROLL</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header
