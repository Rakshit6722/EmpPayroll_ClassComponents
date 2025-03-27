import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoutes from "../components/ProtectedRoutes";
import { vi } from "vitest";

vi.mock("react-router-dom", async () => {
    const actual = await import("react-router-dom");
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => <div>Redirected to {to}</div>,
    };
});

describe("ProtectedRoutes Component", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterAll(() => {
        localStorage.clear();
        vi.resetAllMocks();
    })

    test("renders children when user is authenticated", () => {
        localStorage.setItem("credential", "valid_token");
        localStorage.setItem("userInfo", JSON.stringify({ name: "John Doe" }));

        render(
            <MemoryRouter>
                <ProtectedRoutes>
                    <div>Protected Content</div>
                </ProtectedRoutes>
            </MemoryRouter>
        );

        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    test("redirects to '/' when user is not authenticated", () => {
        render(
            <MemoryRouter>
                <ProtectedRoutes>
                    <div>Protected Content</div>
                </ProtectedRoutes>
            </MemoryRouter>
        );

        expect(screen.getByText("Redirected to /")).toBeInTheDocument();
    });

    test("updates authentication state on storage change", () => {
        const { rerender } = render(
            <MemoryRouter>
                <ProtectedRoutes>
                    <div>Protected Content</div>
                </ProtectedRoutes>
            </MemoryRouter>
        );


        expect(screen.getByText("Redirected to /")).toBeInTheDocument();

        localStorage.setItem("credential", "valid_token");
        localStorage.setItem("userInfo", JSON.stringify({ name: "John Doe" }));
        window.dispatchEvent(new Event("storage"));

        rerender(
            <MemoryRouter>
                <ProtectedRoutes>
                    <div>Protected Content</div>
                </ProtectedRoutes>
            </MemoryRouter>
        );

        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
});
