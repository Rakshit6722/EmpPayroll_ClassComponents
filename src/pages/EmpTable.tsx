import React, { Component } from 'react';
import Header from '../components/Header';
import { deleteEmployee, getEmployees } from '../services/Api';
import addButton from '../assets/add.png'
import deleteIconRed from '../assets/delete-icon-red.png'
import editIcon from '../assets/pen.png'
import searchIcon from '../assets/search_icon.png'
import { NavigateFunction, NavLink } from 'react-router-dom';
import { withRouter } from '../utils/withRouter';
import boy1 from '../assets/boy1.jpeg'
import boy2 from '../assets/boy2.jpeg'
import girl1 from '../assets/girl1.jpeg'
import girl2 from '../assets/girl2.jpeg'
import crossIcon from '../assets/cross-icon.png'

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
    searchQuery: string;
    isSearchActive: boolean;
    deleteModal: boolean
    deleteEmpId:string | number
}

interface EmpTableProps {
    navigate: NavigateFunction
}

class EmpTable extends Component<EmpTableProps, EmpTableState> {
    constructor(props: EmpTableProps) {
        super(props);
        this.state = {
            employees: [],
            searchQuery: '',
            isSearchActive: false,
            deleteModal: false,
            deleteEmpId:""
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

    handleDelete = async () => {
        try {
            // console.log(id)
            const response = await deleteEmployee(String(this.state.deleteEmpId));
            if (response.status === 200) {
                this.fetchData();
                this.setState({
                    deleteModal: false,
                    deleteEmpId: "" 
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    handleDeleteModal = (id: string) => {
        this.setState({ deleteModal: true, deleteEmpId: id })
    }



    handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchQuery: event.target.value });
    }

    handleSearchToggle = () => {
        this.setState((prevState) => ({
            isSearchActive: !prevState.isSearchActive,
            searchQuery: ''
        }))
    }
    getFilteredEmployees = () => {
        const { employees, searchQuery } = this.state;
        return employees.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    formatDate = (dateObj: { day: string; month: string; year: string }) => {
        if (!dateObj) return "";
        return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
    }

    render() {
        const filteredEmployees = this.getFilteredEmployees();
        return (
            <>
                <Header />
                <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
                    <main className="flex flex-col items-center w-full px-4 sm:px-8 py-8 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between w-full sm:w-4/5 space-y-4 sm:space-y-0">
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-gray-700">Employee Details</h2>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <div className="flex items-center space-x-4">

                                    {this.state.isSearchActive ? (
                                        <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg w-full sm:w-auto">
                                            <input
                                                type="text"
                                                id="emp-main-search_box"
                                                className="w-full outline-none border-none bg-transparent"
                                                placeholder="Search..."
                                                value={this.state.searchQuery}
                                                onChange={this.handleSearch}
                                            />
                                            <button className="flex items-center justify-center cursor-pointer" onClick={this.handleSearchToggle}>
                                                <img src={crossIcon} alt='cross-icon' className='w-5' />
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="cursor-pointer bg-white rounded-xl py-2 px-3" onClick={this.handleSearchToggle}>
                                            <img src={searchIcon} alt="search" className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 bg-[#82A70C] text-white py-2 px-4 rounded w-full sm:w-auto text-center">
                                    <NavLink to={"/empRegister"} className="flex items-center justify-center space-x-2 no-underline w-full">
                                        <img src={addButton} alt="add" className="w-4 h-4" />
                                        <p>Add User</p>
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-4/5 overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-700 text-white rounded-t">
                                    <tr>
                                        <td className="p-4 text-start"></td>
                                        <td className="p-4 text-start">NAME</td>
                                        <td className="p-4 text-start hidden sm:table-cell">GENDER</td>
                                        <td className="p-4 text-start hidden md:table-cell">DEPARTMENT</td>
                                        <td className="p-4 text-start hidden md:table-cell">SALARY</td>
                                        <td className="p-4 text-start hidden sm:table-cell">START DATE</td>
                                        <td className="p-4 text-start">ACTION</td>
                                    </tr>
                                </thead>
                                <tbody className="border-2 border-gray-200">
                                    {filteredEmployees.length > 0 ? (
                                        filteredEmployees.map((employee) => (
                                            <tr key={employee.id} className="border-b border-gray-200">
                                                <td className="p-4 bg-white">
                                                    <div className="flex items-start space-x-4">
                                                        {(() => {
                                                            let profileImageSrc;
                                                            if (employee.profileImage === '../assets/boy1.jpeg') {
                                                                profileImageSrc = boy1;
                                                            } else if (employee.profileImage === '../assets/boy2.jpeg') {
                                                                profileImageSrc = boy2;
                                                            } else if (employee.profileImage === '../assets/girl1.jpeg') {
                                                                profileImageSrc = girl1;
                                                            } else {
                                                                profileImageSrc = girl2;
                                                            }
                                                            return (
                                                                <img
                                                                    src={profileImageSrc}
                                                                    alt={employee.name}
                                                                    className="w-8 h-8 rounded-full"
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                </td>
                                                <td className="p-4 bg-white">  <span className="truncate bg-white max-w-[150px]">{employee.name}</span></td>
                                                <td className="p-4 text-start bg-white hidden sm:table-cell">{employee.gender}</td>
                                                <td className="p-4 text-start bg-white hidden md:table-cell">
                                                    {Array.isArray(employee.department) ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {employee.department.map((dept) => (
                                                                <span
                                                                    key={dept}
                                                                    className="px-2 py-1 text-xs font-medium text-black bg-[#E9FEA5] rounded-lg"
                                                                >
                                                                    {dept}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-lg">
                                                            {employee.department}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-4 text-start bg-white hidden md:table-cell">{employee.salary}</td>
                                                <td className="p-4 text-start bg-white hidden sm:table-cell">
                                                    {this.formatDate(employee.startDate)}
                                                </td>
                                                <td className="p-4 text-start bg-white">
                                                    <div className="flex justify-start space-x-2">
                                                        <button
                                                            onClick={() => this.handleDeleteModal(employee.id)}
                                                            className="p-0 border-none bg-transparent cursor-pointer"
                                                            aria-label="Delete Employee"
                                                        >
                                                            <img
                                                                src={deleteIconRed}
                                                                alt="delete"
                                                                className="w-5 h-5"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => this.handleEdit(employee.id)}
                                                            className="p-0 border-none bg-transparent cursor-pointer"
                                                            aria-label="Edit Employee"
                                                        >
                                                            <img
                                                                src={editIcon}
                                                                alt="edit"
                                                                className="w-5 h-5"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center bg-white">No employees found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </main>
                </div>
                {
                    this.state.deleteModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded-lg w-96">
                                <h2 className="text-xl font-bold text-gray-700">Delete Employee</h2>
                                <p className="text-gray-500 text-sm">Are you sure you want to delete this employee?</p>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        onClick={() => this.setState({ deleteModal: false })}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={this.handleDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </>
        );
    }
}

export default withRouter(EmpTable);