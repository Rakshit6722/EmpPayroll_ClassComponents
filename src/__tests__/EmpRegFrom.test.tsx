import { MemoryRouter } from "react-router-dom";
import EmpRegForm from "../pages/EmpRegForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as Api from '../services/Api'
import { AxiosResponse } from 'axios';
import { toast } from "react-toastify";
import { vi } from "vitest";

vi.mock("../services/Api")
vi.mock("react-toastify", () => ({
    toast: {
        success: vi.fn()
    }
}))

const mockNavigate = vi.fn()

describe("Employee Register Form Unit Tests", () => {
    test("should render the component", () => {
        render(<MemoryRouter>
            <EmpRegForm />
        </MemoryRouter>
        );
        const empRegForm = screen.getByText(/employee payroll form/i);
        expect(empRegForm).toBeInTheDocument();
    });

    test("should render the form with input fields", () => {
        render(<MemoryRouter>
            <EmpRegForm />
        </MemoryRouter>
        );
        const form = screen.getByTestId("form");
        expect(form).toBeInTheDocument();
        const inputFields = screen.getAllByTestId("input-fields");
        expect(inputFields).toHaveLength(16);
    });

    test("name input field should accept input", () => {
        render(<MemoryRouter>
            <EmpRegForm />
        </MemoryRouter>
        );
        const nameInput = screen.getByRole("textbox", { name: /name/i });
        fireEvent.change(nameInput, { target: { value: "Rakshit" } });
        expect(nameInput).toHaveValue("Rakshit");
    });


    test("show name validation error when name is not given", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument()

        fireEvent.submit(screen.getByTestId("form"))

        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })


    test("profile images selection", () => {
        const profileImages = [
            { src: "image1.jpg", value: "image1" },
            { src: "image2.jpg", value: "image2" },
            { src: "image3.jpg", value: "image3" },
            { src: "image4.jpg", value: "image4" },
        ]

        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        const profileImagesRadioButtons = screen.getAllByRole("radio").slice(0, profileImages.length)

        expect(profileImagesRadioButtons).toHaveLength(profileImages.length)

        profileImagesRadioButtons.forEach((radioButton) => {
            expect(radioButton).not.toBeChecked()
        })

        fireEvent.click(profileImagesRadioButtons[0])

        expect(profileImagesRadioButtons[0]).toBeChecked()

        fireEvent.click(profileImagesRadioButtons[1])

        expect(profileImagesRadioButtons[0]).not.toBeChecked()
        expect(profileImagesRadioButtons[1]).toBeChecked()

    })


    test("shows profile image error when no profile image is selected", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        expect(screen.queryByText(/profile image is required/i)).not.toBeInTheDocument()

        fireEvent.submit(screen.getByTestId("form"))

        expect(screen.getByText(/profile image is required/i)).toBeInTheDocument()
    })


    test("gender selection", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        const maleRadioButton = screen.getByLabelText("Male")
        const femaleRadioButton = screen.getByLabelText("Female")

        expect(maleRadioButton).not.toBeChecked()
        expect(femaleRadioButton).not.toBeChecked()

        fireEvent.click(maleRadioButton)
        expect(maleRadioButton).toBeChecked()

        fireEvent.click(femaleRadioButton)
        expect(maleRadioButton).not.toBeChecked()
        expect(femaleRadioButton).toBeChecked()
    })

    test("shows gender validation error if no gender is selected", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        expect(screen.queryByText(/gender is required/i)).not.toBeInTheDocument()

        fireEvent.submit(screen.getByTestId("form"))

        expect(screen.getByText(/gender is required/i)).toBeInTheDocument()
    })

    test("department checkbox selection", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        const departmentCheckboxes = screen.getAllByRole("checkbox")

        expect(departmentCheckboxes).toHaveLength(5)

        fireEvent.click(screen.getByLabelText("HR"))
        fireEvent.click(screen.getByLabelText("Sales"))

        expect(screen.getByLabelText("HR")).toBeChecked()
        expect(screen.getByLabelText("Sales")).toBeChecked()
    })

    test("show error when no department is selected", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        expect(screen.queryByText(/at least one department is required/i)).not.toBeInTheDocument()

        fireEvent.submit(screen.getByTestId("form"))

        expect(screen.getByText(/at least one department is required/i)).toBeInTheDocument()
    })


    test("salary range selection", async () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        const salaryRange = screen.getByTestId("salary-dropdown-fields")

        expect(salaryRange).toHaveValue("")

        await userEvent.selectOptions(salaryRange, "20000")

        expect(salaryRange).toHaveValue("20000")
    })

    test("show error when no salary range is selected", () => {
        render(<MemoryRouter><EmpRegForm /></MemoryRouter>)

        expect(screen.queryByText(/salary is required/i)).not.toBeInTheDocument()

        fireEvent.submit(screen.getByTestId("form"))

        expect(screen.getByText(/salary is required/i)).toBeInTheDocument()
    })
});

describe("Employee register form handleSubmit", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <EmpRegForm navigate={mockNavigate} />
            </MemoryRouter>
        )
    }

    test("should show validation erros when form is submitted empty", async () => {
        renderComponent()

        const form = screen.getByTestId('form');
        const submitButton = screen.getByText('Submit');

        fireEvent.submit(form);

        await waitFor(
            () => {
                expect(screen.getByText(/name is required/i)).toBeInTheDocument();
                expect(screen.getByText(/profile image is required/i)).toBeInTheDocument();
                expect(screen.getByText(/gender is required/i)).toBeInTheDocument();
                expect(screen.getByText(/at least one department is required/i)).toBeInTheDocument();
                expect(screen.getByText(/salary is required/i)).toBeInTheDocument();
                expect(screen.getByText(/complete start date is required/i)).toBeInTheDocument();
            },
        );
    })

    test("submits form with validation date", async () => {
        const mockAddEmployee = vi.mocked(Api.addEmployee).mockResolvedValue({
            status: 200,
            data: {},
            statusText: "OK",
            headers: {},
            config: {}
        } as AxiosResponse)

        renderComponent()

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });


        const profileImageRadios = screen.getAllByRole('radio', { name: /profile/i });
        fireEvent.click(profileImageRadios[0]);


        fireEvent.click(screen.getByLabelText('Male'));


        fireEvent.click(screen.getByLabelText('HR'));


        fireEvent.change(screen.getByTestId('salary-dropdown-fields'), { target: { value: '20000' } });


        const startDateDay = screen.getAllByTestId('input-fields').find(el => el.getAttribute('name') === 'startDate.day');
        const startDateMonth = screen.getAllByTestId('input-fields').find(el => el.getAttribute('name') === 'startDate.month');
        const startDateYear = screen.getAllByTestId('input-fields').find(el => el.getAttribute('name') === 'startDate.year');

        if (!startDateDay || !startDateMonth || !startDateYear) {
            throw new Error('Start date fields not found');
        }

        fireEvent.change(startDateDay, { target: { value: '15' } });
        fireEvent.change(startDateMonth, { target: { value: '6' } });
        fireEvent.change(startDateYear, { target: { value: '2023' } });


        fireEvent.change(screen.getByLabelText('Notes'), { target: { value: 'Test note' } });

        const form = screen.getByTestId('form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockAddEmployee).toHaveBeenCalledWith({
                name: 'John Doe',
                profileImage: '../assets/boy1.jpeg',
                gender: 'male',
                department: ['HR'],
                salary: '20000',
                startDate: { day: '15', month: '6', year: '2023' },
                notes: 'Test note',
                errors: {},
                empId: '',
            });
            expect(toast.success).toHaveBeenCalledWith('Employee added successfully');
        },
    {timeout: 2000});

    })
})

