import { vi } from "vitest"
import Header from "../components/Header"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"

const mockedNavigate = vi.fn()

describe("Header component tests", () => {

    beforeEach(() => {
        localStorage.setItem('userInfo', 'testUser');
        localStorage.setItem('credential', 'testCredential');
    });

    afterEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });
    
     
    test("should render the component", () => {
        render(<MemoryRouter>
            <Header navigate={mockedNavigate}/>
            </MemoryRouter>)
        expect(screen.getByText(/payroll/i)).toBeInTheDocument()
    })

    test("should not render logout button if container is login", () => {
        render(<MemoryRouter>
            <Header navigate={mockedNavigate} container="login"/>
        </MemoryRouter>)

        expect(screen.queryByText(/logout/i)).not.toBeInTheDocument()
    })

    test('logs out and navigates to "/" when logout button is clicked', () => {
       
        render(<Header navigate={mockedNavigate} />, { wrapper: MemoryRouter });

        expect(localStorage.getItem('userInfo')).toBe('testUser');
        expect(localStorage.getItem('credential')).toBe('testCredential');


        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);


        expect(localStorage.getItem('userInfo')).toBeNull();
        expect(localStorage.getItem('credential')).toBeNull();

    });

})