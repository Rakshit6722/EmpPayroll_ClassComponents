import { MemoryRouter } from "react-router-dom"
import GitHubCallback from "../pages/GIthubCallback"
import { render, screen, waitFor } from "@testing-library/react"
import { vi } from "vitest"



const mockedNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

    return {
        ...actual,
        useNavigate: () => mockedNavigate,
        NavLink: ({ to, children }: { to: string; children: React.ReactNode }) => (
            <div data-mocked-navlink={to}>{children}</div>
        )
    };
});

describe("GithubCallback Component", () => {

    beforeEach(() => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: async () => ({ access_token: 'mock-access-token' }),
                ok: true
            })
            .mockResolvedValueOnce({
                json: async () => ({ name: 'user 1', login: 'user1' }),
                ok: true
            })
            .mockResolvedValueOnce({
                json: async () => [{ email: 'user1@example.com', primary: true }],
                ok: true
            })

        vi.spyOn(Storage.prototype, 'setItem');
    })

    test("should render the component", () => {
        render(
            <MemoryRouter initialEntries={["/github/callback?code=123"]}>
                <GitHubCallback />
            </MemoryRouter>
        )
        waitFor(() => {
            const heading = screen.getByText(/GitHub/i)
            expect(heading).toBeInTheDocument()
        })
    })

    test("should show loading message", () => {
        render(
            <MemoryRouter initialEntries={["/github/callback?code=123"]}>
                <GitHubCallback />
            </MemoryRouter>

        )
        expect(screen.getByText(/Processing/i)).toBeInTheDocument()
    })

    test('handles GitHub OAuth callback and navigates to /empTable', async () => {
        render(<MemoryRouter initialEntries={["/github/callback?code=123"]}>
            <GitHubCallback />
        </MemoryRouter>);
    
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledTimes(3);
        });
    
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'userInfo',
          JSON.stringify({
            name: 'user 1',
            login: 'user1',
            given_name: 'user 1',
            email: 'user1@example.com'
          })
        );
    
        expect(localStorage.setItem).toHaveBeenCalledWith('credential', 'mock-access-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('authProvider', 'github');
    
        expect(mockedNavigate).toHaveBeenCalledWith('/empTable');
      });

})