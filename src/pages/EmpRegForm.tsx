import React, { Component, ChangeEvent, FormEvent } from 'react';
import boy1 from '../assets/boy1.jpeg';
import boy2 from '../assets/boy2.jpeg';
import girl1 from '../assets/girl1.jpeg';
import girl2 from '../assets/girl2.jpeg';
import Header from '../components/Header';
import { addEmployee, editEmployee, getIndividualEmployee } from '../services/Api';
import { toast } from 'react-toastify';
import { NavigateFunction } from 'react-router-dom';
import { withRouter } from '../utils/withRouter';

const profileImages = [
    { src: boy1, value: "../assets/boy1.jpeg" },
    { src: boy2, value: "../assets/boy2.jpeg" },
    { src: girl1, value: "../assets/girl1.jpeg" },
    { src: girl2, value: "../assets/girl2.jpeg" },
]

interface EmpRegFormState {
    name: string;
    profileImage: string;
    gender: string;
    department: string[];
    salary: string;
    startDate: {
        day: string;
        month: string;
        year: string;
    };
    notes: string;
    errors: {
        name?: string;
        profileImage?: string;
        gender?: string;
        department?: string;
        salary?: string;
        startDate?: string;
    };
    empId: string
}

interface EmpRegFromProps {
    navigate: NavigateFunction
}

export class EmpRegForm extends Component<EmpRegFromProps, EmpRegFormState> {
    constructor(props: EmpRegFromProps) {
        super(props);
        this.state = {
            name: '',
            profileImage: '',
            gender: '',
            department: [],
            salary: '',
            startDate: { day: '', month: '', year: '' },
            notes: '',
            errors: {},
            empId: localStorage.getItem('empId') ?? ''
        };
    }

    handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            this.setState((prevState) => ({
                ...prevState,
                department: checked
                    ? [...prevState.department, value]
                    : prevState.department.filter(dep => dep !== value),
                errors: {
                    ...prevState.errors,
                    department: undefined
                }
            }));
        } else if (name.startsWith("startDate.")) {
            const key = name.split('.')[1];
            this.setState((prevState) => ({
                ...prevState,
                startDate: {
                    ...prevState.startDate,
                    [key]: value
                },
                errors: {
                    ...prevState.errors,
                    startDate: undefined
                }
            }));
        } else {
            this.setState((prevState) => ({
                ...prevState,
                [name]: value,
                errors: {
                    ...prevState.errors,
                    [name]: undefined
                }
            }))
        }
    }

    componentDidMount(): void {
        if (this.state.empId) {
            this.getEmployee(this.state.empId)
        }
    }

    getEmployee = async (empId: string) => {
        try {
            const response = await getIndividualEmployee(empId)
            if (response.status === 200) {
                this.setState({
                    name: response.data.name || '',
                    profileImage: response.data.profileImage || '',
                    gender: response.data.gender || '',
                    department: response.data.department || [],
                    salary: response.data.salary || '',
                    startDate: response.data.startDate || { day: '', month: '', year: '' },
                    notes: response.data.notes || '',
                });
            }

        } catch (err) {
            console.log(err)
        }
    }

    validateForm = () => {
        const errors: EmpRegFormState['errors'] = {};
        const { name, profileImage, gender, department, salary, startDate } = this.state;

        if (!name.trim()) errors.name = 'Name is required';
        if (!profileImage) errors.profileImage = 'Profile image is required';
        if (!gender) errors.gender = 'Gender is required';
        if (department.length === 0) errors.department = 'At least one department is required';
        if (!salary) errors.salary = 'Salary is required';
        if (!startDate.day || !startDate.month || !startDate.year) {
            errors.startDate = 'Complete start date is required';
        }

        return errors;
    }

    handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = this.validateForm();

        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
            return;
        }

        try {
            const response = await addEmployee(this.state)
            if (response) {
                this.props.navigate("/")
                toast.success('Employee added successfully');
                this.setState({
                    name: '',
                    profileImage: '',
                    gender: '',
                    department: [],
                    salary: '',
                    startDate: { day: '', month: '', year: '' },
                    notes: '',
                    errors: {}
                })
            }
        } catch (err) {
            console.log(err);
        }
    }

    handleReset = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        this.setState({
            name: '',
            profileImage: '',
            gender: '',
            department: [],
            salary: '',
            startDate: { day: '', month: '', year: '' },
            notes: '',
            errors: {}
        })
    }

    handleUpdate = async () => {
        try {
            const response = await editEmployee(this.state.empId, this.state)
            if (response.status === 200) {
                localStorage.removeItem('empId')
                toast.success('Employee updated successfully')
                this.props.navigate('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        const { errors } = this.state;

        return (
            <>
                <Header />
                <div className="w-full bg-[#F7F7F7] p-4 md:p-8 overflow-y-auto">
                    <form 
                        data-testid="form" 
                        onSubmit={this.handleSubmit} 
                        className="w-full max-w-4xl mx-auto bg-white py-6 px-4 md:px-16 flex flex-col gap-8 text-left text-base md:text-lg text-[#42515F]"
                    >
                        <h2 className="text-left text-xl md:text-2xl font-bold text-[#42515F] capitalize">Employee Payroll Form</h2>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <label htmlFor='name' className="w-full md:w-1/4 min-w-24 mb-2 md:mb-0">Name</label>
                                <div className="w-full md:w-3/4 relative">
                                    <input
                                        data-testid="input-fields"
                                        type="text"
                                        name="name"
                                        id='name'
                                        required
                                        className={`w-full h-10 p-2 border rounded ${errors.name ? 'border-red-500' : 'border-[#BDBDBD]'}`}
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                    />
                                    {errors.name && (
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500 text-sm pointer-events-none">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <label htmlFor='profileImage' className="w-full md:w-1/4 min-w-24 mb-2 md:mb-0">Profile Image</label>
                                <div className="flex flex-wrap gap-4 w-full md:w-3/4">
                                    {profileImages.map((imgSrc, index) => (
                                        <label key={imgSrc.value} className="flex gap-3 items-center">
                                            <input
                                                id='profileImage'
                                                data-testid="input-fields"
                                                type="radio"
                                                name="profileImage"
                                                value={imgSrc.value}
                                                className="w-5 h-5"
                                                checked={this.state.profileImage === imgSrc.value}
                                                onChange={this.handleChange}
                                            />
                                            <img src={imgSrc.src} alt={`Profile ${index + 1}`} className="w-8 h-8 rounded-full" />
                                        </label>
                                    ))}
                                    {errors.profileImage && (
                                        <span className="text-red-500 text-sm w-full">{errors.profileImage}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <label htmlFor='genderRadioButtons' className="w-full md:w-1/4 min-w-24 font-medium mb-2 md:mb-0">Gender</label>
                                <div className="flex flex-col md:flex-row md:gap-6 gap-3 w-full md:w-3/4">
                                    <label htmlFor='male' className="flex items-center gap-4">
                                        <input
                                            data-testid="input-fields"
                                            type="radio"
                                            name="gender"
                                            value="male"
                                            id="male"
                                            checked={this.state.gender === "male"}
                                            onChange={this.handleChange}
                                            className="w-5 h-5"
                                            />
                                        Male
                                    </label>
                                    <label htmlFor='female' className="flex items-center gap-4">
                                        <input
                                            data-testid="input-fields"
                                            type="radio"
                                            name="gender"
                                            id='female'
                                            value="female"
                                            className="w-5 h-5"
                                            checked={this.state.gender === "female"}
                                            onChange={this.handleChange}
                                        />
                                        Female
                                    </label>
                                    {errors.gender && (
                                        <span className="text-red-500 text-sm w-full">{errors.gender}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <label htmlFor='departmentCheckbox' className="w-full md:w-1/4 min-w-24 font-medium mb-2 md:mb-0">Department</label>
                                <div className="flex flex-col md:flex-row md:flex-wrap md:gap-4 gap-3 w-full md:w-3/4">
                                    {['HR', 'Sales', 'Finance', 'Engineer', 'Other'].map(dep => (
                                        <label key={dep} className="flex items-center gap-4">
                                            <input
                                                data-testid="input-fields"
                                                type="checkbox"
                                                name="department"
                                                value={dep}
                                                className="w-5 h-5 border rounded"
                                                checked={this.state.department.includes(dep)}
                                                onChange={this.handleChange}
                                            />
                                            {dep}
                                        </label>
                                    ))}
                                    {errors.department && (
                                        <span className="text-red-500 text-sm w-full">{errors.department}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <label htmlFor='salary' className="w-full md:w-1/4 min-w-24 font-medium mb-2 md:mb-0">Salary</label>
                                <div className="w-full md:w-3/4 relative">
                                    <select
                                        data-testid="salary-dropdown-fields"
                                        name="salary"
                                        required
                                        value={this.state.salary}
                                        onChange={this.handleChange}
                                        className={`w-full h-10 p-2 border rounded ${errors.salary ? 'border-red-500' : 'border-[#BDBDBD]'}`}
                                    >
                                        <option value="" disabled>Select Salary</option>
                                        <option value="10000">₹10,000</option>
                                        <option value="20000">₹20,000</option>
                                        <option value="30000">₹30,000</option>
                                    </select>
                                    {errors.salary && (
                                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500 text-sm pointer-events-none">
                                            {errors.salary}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <label htmlFor='startDate' className="w-full md:w-1/4 min-w-24 font-medium mb-2 md:mb-0">Start Date</label>
                                <div className="flex flex-col w-full md:w-3/4 gap-3">
                                    <div className="flex flex-col md:flex-row md:gap-4 gap-3">
                                        <select
                                            data-testid="input-fields"
                                            name="startDate.day"
                                            required
                                            value={this.state.startDate.day}
                                            onChange={this.handleChange}
                                            className={`w-full md:w-28 h-10 p-2 border rounded ${errors.startDate ? 'border-red-500' : 'border-[#BDBDBD]'}`}
                                        >
                                            <option value="" disabled>Day</option>
                                            {[...Array(31)].map((_, i) => {
                                                const day = i + 1;
                                                return <option key={day} value={day}>{day}</option>;
                                            })}
                                        </select>
                                        <select
                                            data-testid="input-fields"
                                            name="startDate.month"
                                            required
                                            value={this.state.startDate.month}
                                            onChange={this.handleChange}
                                            className={`w-full md:w-36 h-10 p-2 border rounded ${errors.startDate ? 'border-red-500' : 'border-[#BDBDBD]'}`}
                                        >
                                            <option value="" disabled>Month</option>
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                                                <option key={month} value={i + 1}>{month}</option>
                                            ))}
                                        </select>
                                        <select
                                            data-testid="input-fields"
                                            name="startDate.year"
                                            required
                                            value={this.state.startDate.year}
                                            onChange={this.handleChange}
                                            className={`w-full md:w-28 h-10 p-2 border rounded ${errors.startDate ? 'border-red-500' : 'border-[#BDBDBD]'}`}
                                        >
                                            <option value="" disabled>Year</option>
                                            {[2021, 2022, 2023, 2024, 2025].map(year => <option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                    {errors.startDate && (
                                        <span className="text-red-500 text-sm">{errors.startDate}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start gap-4">
                                <label htmlFor='notes' className="w-full md:w-1/4 min-w-24 font-medium mb-2 md:mb-0">Notes</label>
                                <textarea
                                    data-testid="input-fields"
                                    name="notes"
                                    id='notes'
                                    className="w-full md:w-3/4 h-20 p-2 border border-[#BDBDBD] rounded"
                                    value={this.state.notes}
                                    onChange={this.handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
                            <button
                                onClick={() => this.props.navigate('/')}
                                type="button"
                                className="w-full md:w-1/4 py-3 px-6 border border-[#969696] rounded cursor-pointer bg-[#E2E2E2] hover:bg-[#707070] hover:text-white"
                            >
                                Cancel
                            </button>
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/4 justify-end">
                                {this.state.empId ? (
                                    <button
                                        onClick={this.handleUpdate}
                                        type="button"
                                        className="w-full md:w-1/2 py-3 px-6 border border-[#969696] rounded cursor-pointer bg-[#E2E2E2] hover:bg-[#82A70C] hover:text-white"
                                    >
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        id="submit-button"
                                        className="w-full md:w-1/2 py-3 px-6 border border-[#969696] rounded cursor-pointer bg-[#E2E2E2] hover:bg-[#82A70C] hover:text-white"
                                    >
                                        Submit
                                    </button>
                                )}

                                <button
                                    onClick={this.handleReset}
                                    type="reset"
                                    className="w-full md:w-1/2 py-3 px-6 border border-[#969696] rounded cursor-pointer bg-[#E2E2E2] hover:bg-[#707070] hover:text-white"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}

export default withRouter(EmpRegForm);