import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuthWrapper from "../pages/Login";
import { vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock("@react-oauth/google", () => ({
    GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    GoogleLogin: ({ onSuccess, onError }: { onSuccess: (res: any) => void; onError: () => void }) => (
        <button onClick={() => onSuccess({ credential: "mocked_credential" })}>
            Google Login
        </button>
    ),
}));

describe("Login Component", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.resetAllMocks();
    });

    const renderComponent = () => {
        render(
            <GoogleOAuthProvider clientId="test-client-id">
                <MemoryRouter>
                    <GoogleAuthWrapper />
                </MemoryRouter>
            </GoogleOAuthProvider>
        );
    };

    test("renders login page with Google login button", () => {
        renderComponent();
        expect(screen.getByRole("heading", { name: /Employee Login/i })).toBeInTheDocument();
        expect(screen.getByText("Google Login")).toBeInTheDocument();
    });


    test("handles login failure", async () => {
        vi.mock("@react-oauth/google", () => ({
            GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
            GoogleLogin: ({ onSuccess, onError }: { onSuccess: (res: any) => void; onError: () => void }) => (
                <button onClick={onError}>Google Login</button>
            ),
        }));

        renderComponent();
        
        fireEvent.click(screen.getByText("Google Login"));

        await waitFor(() => {
            expect(screen.getByText("Login Failed. Please try again.")).toBeInTheDocument();
        });
    });

});
