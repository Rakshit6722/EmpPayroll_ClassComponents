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
            name: "John Doe",
            gender: "Male",
            department: ["HR"],
            salary: "50000",
            startDate: { day: "01", month: "01", year: "2022" },
            profileImage: "../assets/boy1.jpeg",
        },
        {
            id: "2",
            name: "Jane Doe",
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

    test("renders the Employee Table component", async () => {
        await renderComponent();

        expect(screen.getByRole("heading", { name: /Employee Details/i })).toBeInTheDocument();
        expect(screen.getByAltText("search")).toBeInTheDocument(); 
        expect(screen.getByText(/Add User/i)).toBeInTheDocument();
    });

    test("fetches and displays employee data", async () => {
        await renderComponent();

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Doe")).toBeInTheDocument();
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

        fireEvent.change(searchInput, { target: { value: "Jane" } });

        await waitFor(() => {
            expect(screen.getByText("Jane Doe")).toBeInTheDocument();
            expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        });


        const crossIcon = screen.getByAltText("cross-icon");
        fireEvent.click(crossIcon);

        await waitFor(() => {
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("Jane Doe")).toBeInTheDocument();
            expect(screen.queryByPlaceholderText(/Search.../i)).not.toBeInTheDocument();
        });
    });

    test("handles edit employee action", async () => {
        await renderComponent();

        const editButton = screen.getAllByAltText("edit")[0];
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(localStorage.getItem("empId")).toBe("1");
            expect(mockNavigate).toHaveBeenCalledWith("/empRegister");
        });
    });

    test("handles delete employee action with modal", async () => {
        vi.mocked(deleteEmployee).mockResolvedValue({
            status: 200,
            data: {},
            statusText: "OK",
            headers: {},
            config: {}
        } as AxiosResponse);

        await renderComponent();

        const deleteButton = screen.getAllByAltText("delete")[0];
        fireEvent.click(deleteButton);


        await waitFor(() => {
            expect(screen.getByText("Delete Employee")).toBeInTheDocument();
            expect(screen.getByText("Are you sure you want to delete this employee?")).toBeInTheDocument();
        });


        const confirmDeleteButton = screen.getByText("Delete");
        fireEvent.click(confirmDeleteButton);

        await waitFor(() => {
            expect(deleteEmployee).toHaveBeenCalledWith("1");
            expect(getEmployees).toHaveBeenCalledTimes(2);
            expect(screen.queryByText("Delete Employee")).not.toBeInTheDocument();
        });
    });

    test("cancels delete action from modal", async () => {
        await renderComponent();

        const deleteButton = screen.getAllByAltText("delete")[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText("Delete Employee")).toBeInTheDocument();
        });

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(deleteEmployee).not.toHaveBeenCalled();
            expect(screen.queryByText("Delete Employee")).not.toBeInTheDocument();
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
    });

    test("initially displays no employees before API call", async () => {
        vi.mocked(getEmployees).mockResolvedValue({ data: [] } as AxiosResponse);
        render(
            <MemoryRouter>
                <EmpTable navigate={mockNavigate} />
            </MemoryRouter>
        );

        expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
        expect(screen.getByText("No employees found")).toBeInTheDocument();
    });

    test("does not proceed with deletion if API call fails", async () => {
        vi.mocked(deleteEmployee).mockRejectedValue(new Error("Delete failed"));

        await renderComponent();

        const deleteButton = screen.getAllByAltText("delete")[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText("Delete Employee")).toBeInTheDocument();
        });

        const confirmDeleteButton = screen.getByText("Delete");
        fireEvent.click(confirmDeleteButton);

        await waitFor(() => {
            expect(deleteEmployee).toHaveBeenCalledWith("1");
            expect(getEmployees).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Delete Employee")).toBeInTheDocument(); // Modal stays open on failure
        });
    });

    test("clearing search input resets employee list", async () => {
        await renderComponent();

        const searchIcon = screen.getByAltText("search");
        fireEvent.click(searchIcon);

        const searchInput = screen.getByPlaceholderText(/Search.../i);
        fireEvent.change(searchInput, { target: { value: "Jane" } });

        await waitFor(() => {
            expect(screen.getByText("Jane Doe")).toBeInTheDocument();
            expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
        });

        fireEvent.change(searchInput, { target: { value: "" } });

        await waitFor(() => {
            expect(screen.getByText("John Doe")).toBeInTheDocument();
            expect(screen.getByText("Jane Doe")).toBeInTheDocument();
        });
    });
});