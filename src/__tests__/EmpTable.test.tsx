import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmpTable from "../pages/EmpTable";
import { withRouter } from "../utils/withRouter";
import { vi } from "vitest";
import { getEmployees, deleteEmployee } from "../services/Api";
import { AxiosResponse } from "axios";

vi.mock("../services/Api", () => ({
    getEmployees: vi.fn(),
    deleteEmployee: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        NavLink: ({ to, children }: { to: string; children: React.ReactNode }) => (
            <a href={to}>{children}</a>
        ),
    };
});

describe("EmpTable Component", () => {
    const mockEmployees = [
        {
            id: "1",
            name: "Test User 1",
            gender: "Male",
            department: ["HR"],
            salary: "50000",
            startDate: { day: "01", month: "01", year: "2022" },
            profileImage: "../assets/boy1.jpeg",
        },
        {
            id: "2",
            name: "Test User 2",
            gender: "Female",
            department: ["IT"],
            salary: "60000",
            startDate: { day: "05", month: "02", year: "2021" },
            profileImage: "../assets/girl1.jpeg",
        },
    ];

    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });

    const renderComponent = async () => {
        vi.mocked(getEmployees).mockResolvedValue({ data: mockEmployees } as AxiosResponse);
        render(
            <MemoryRouter>
                <EmpTable navigate={mockNavigate} />
            </MemoryRouter>
        );
        await waitFor(() => expect(getEmployees).toHaveBeenCalled());
    };

    test("fetches and displays employee data", async () => {
        await renderComponent();

        expect(screen.getByText("Test User 1")).toBeInTheDocument();
        expect(screen.getByText("Test User 2")).toBeInTheDocument();
        expect(screen.getByText("HR")).toBeInTheDocument();
        expect(screen.getByText("IT")).toBeInTheDocument();
        expect(screen.getByText("50000")).toBeInTheDocument();
        expect(screen.getByText("60000")).toBeInTheDocument();
        expect(screen.getByText("01/01/2022")).toBeInTheDocument();
        expect(screen.getByText("05/02/2021")).toBeInTheDocument();
    });

    test("toggles search input and filters employees", async () => {
        await renderComponent();

        const searchIcon = screen.getByAltText("search");
        fireEvent.click(searchIcon);

        const searchInput = screen.getByPlaceholderText(/Search.../i);
        expect(searchInput).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "Test User 2" } });

        await waitFor(() => {
            expect(screen.getByText("Test User 2")).toBeInTheDocument();
            expect(screen.queryByText("Test User 1")).not.toBeInTheDocument();
        });

        const crossIcon = screen.getByAltText("cross-icon");
        fireEvent.click(crossIcon);

        await waitFor(() => {
            expect(screen.getByText("Test User 1")).toBeInTheDocument();
            expect(screen.getByText("Test User 2")).toBeInTheDocument();
        });
    });

    test("displays 'No employees found' when no employees match the search", async () => {
        await renderComponent();

        const searchIcon = screen.getByAltText("search");
        fireEvent.click(searchIcon);

        const searchInput = screen.getByPlaceholderText(/Search.../i);
        fireEvent.change(searchInput, { target: { value: "Random Name" } });

        await waitFor(() => {
            expect(screen.getByText("No employees found")).toBeInTheDocument();
        });
    })
    
    test("shows delete confirmation modal and deletes employee on confirmation", async () => {

        vi.mocked(getEmployees).mockResolvedValue({ data: mockEmployees } as AxiosResponse);

        vi.mocked(deleteEmployee).mockResolvedValue({ status: 200 } as AxiosResponse);
    
        render(
            <MemoryRouter>
                <EmpTable navigate={mockNavigate} />
            </MemoryRouter>
        );
    
        await waitFor(() => expect(getEmployees).toHaveBeenCalled());
    
        const deleteButtons = screen.getAllByLabelText("Delete Employee");
        fireEvent.click(deleteButtons[0]);
    
        expect(screen.getByText("Delete Employee")).toBeInTheDocument();
        expect(screen.getByText("Are you sure you want to delete this employee?")).toBeInTheDocument();
    
        const confirmDeleteButton = screen.getByText("Delete");
        fireEvent.click(confirmDeleteButton);
    
        await waitFor(() => {
            expect(deleteEmployee).toHaveBeenCalledWith("1"); 
            expect(getEmployees).toHaveBeenCalledTimes(2); 
            expect(screen.queryByText("Delete Employee")).not.toBeInTheDocument();
        });
    });
    
    ;
});