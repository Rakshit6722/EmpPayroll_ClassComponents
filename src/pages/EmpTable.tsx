import React, { Component } from 'react';
import Header from '../components/Header';
import { deleteEmployee, getEmployees } from '../services/Api';
import addButton from '../assets/add.png'
import deleteIcon from '../assets/delete.png'
import editIcon from '../assets/pen.png'
import searchIcon from '../assets/search_icon.png'
import { NavigateFunction, NavLink } from 'react-router-dom';
import { withRouter } from '../utils/withRouter';

interface EmpTableState {
    employees: Array<{
        id: string;
        name: string;
        gender: string;
        department: string[];
        salary: string;
        startDate: {
            day: string;
            month: string;
            year: string;
        }
        profileImage: string;
    }>;
}

interface EmpTableProps{
    navigate: NavigateFunction
}

class EmpTable extends Component<EmpTableProps, EmpTableState> {
    constructor(props: EmpTableProps) {
        super(props);
        this.state = {
            employees: []
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const response = await getEmployees();
            this.setState({ employees: response.data });
            console.log(response?.data);
        } catch (err) {
            console.log(err);
        }
    };

    handleEdit = (id: string) => {
        localStorage.setItem('empId', id);
        this.props.navigate('/empRegister');
    }

    handleDelete = async (id: string) => {
       try{
        console.log(id)
        const response = await deleteEmployee(String(id));
        if(response.status === 200){
            this.fetchData();
        }
       }catch(err){
            console.log(err);
       }
    }

    searchByName = () => {
        // Search functionality to be implemented
    }


    formatDate = (dateObj: { day: string; month: string; year: string }) => {
        if (!dateObj) return "";
        return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
    }

    render() {
        return (
            <>
                <Header />
                <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
                    <main className="flex flex-col items-center w-full p-8 space-y-8">

                        <div className="flex justify-between w-4/5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-700">Employee Details</h2>
                            </div>
                            <div className="flex items-center space-x-4">

                                <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg">
                                    <input
                                        type="text"
                                        id="emp-main-search_box"
                                        className="w-full outline-none border-none bg-transparent"
                                        placeholder="Search..."
                                    />
                                    <div className="flex items-center justify-center cursor-pointer" onClick={this.searchByName}>
                                        <img src={searchIcon} alt="search" className="w-5 h-5" />
                                    </div>
                                </div>


                                <div className="flex items-center space-x-2 bg-[#82A70C] text-white py-2 px-4 rounded">
                                    <NavLink to={"/empRegister"} className="flex items-center space-x-2 no-underline">
                                        <img src={addButton} alt="add" className="w-4 h-4" />
                                        <p>Add User</p>
                                    </NavLink>
                                </div>
                            </div>
                        </div>


                        <div className="w-4/5">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-700 text-white rounded-t">
                                    <tr>
                                        <td className="p-4 text-center">NAME</td>
                                        <td className="p-4 text-center">GENDER</td>
                                        <td className="p-4 text-center">DEPARTMENT</td>
                                        <td className="p-4 text-center">SALARY</td>
                                        <td className="p-4 text-center">START DATE</td>
                                        <td className="p-4 text-center">ACTION</td>
                                    </tr>
                                </thead>
                                <tbody className="border-2 border-gray-200">
                                    {this.state.employees.length > 0 ? (
                                        this.state.employees.map((employee) => (
                                            <tr key={employee.id} className="border-b border-gray-200">
                                                <td className="p-4 bg-white">
                                                    <div className="flex items-center space-x-4">
                                                        <img
                                                            src={employee.profileImage}
                                                            alt={employee.name}
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                        <span>{employee.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center bg-white">{employee.gender}</td>
                                                <td className="p-4 text-center bg-white">
                                                    {Array.isArray(employee.department)
                                                        ? employee.department.join(' ')
                                                        : employee.department}
                                                </td>
                                                <td className="p-4 text-center bg-white">{employee.salary}</td>
                                                <td className="p-4 text-center bg-white">
                                                    {this.formatDate(employee.startDate)}
                                                </td>
                                                <td className="p-4 text-center bg-white">
                                                    <div className="flex justify-center space-x-2">
                                                        <img
                                                            src={deleteIcon}
                                                            alt="delete"
                                                            className="w-5 h-5 cursor-pointer"
                                                            onClick={() => this.handleDelete(employee.id)}
                                                        />
                                                        <img
                                                            src={editIcon}
                                                            alt="edit"
                                                            className="w-5 h-5 cursor-pointer"
                                                            onClick={() => this.handleEdit(employee.id)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-gray-200">
                                            <td className="p-4 bg-white">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src="../assets/boy1.jpeg"
                                                        alt="John Doe"
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                    <span>John Doe</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center bg-white">Male</td>
                                            <td className="p-4 text-center bg-white">Sales HR Finance</td>
                                            <td className="p-4 text-center bg-white">Rs.10,000</td>
                                            <td className="p-4 text-center bg-white">29 October 2025</td>
                                            <td className="p-4 text-center bg-white">
                                                <div className="flex justify-center space-x-2">
                                                    <img src={deleteIcon} alt="delete" className="w-5 h-5 cursor-pointer" />
                                                    <img src={editIcon} alt="edit" className="w-5 h-5 cursor-pointer" />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
            </>
        );
    }
}

export default withRouter(EmpTable);