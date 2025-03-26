import { MemoryRouter } from "react-router-dom";
import AuthRoute from "../components/AuthRoute";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../utils/withRouter", () => ({
    withRouter: (Component: any) => Component,
}));

describe("Auth Route component", () => {

    afterEach(() => {
        localStorage.clear();
    });
    test("should render the component", () => {
        render(
            <MemoryRouter>
                <AuthRoute>
                    <div data-testid="child-element">Protected Content</div>
                </AuthRoute>
            </MemoryRouter>
        );


        expect(screen.getByTestId("child-element")).toBeInTheDocument();
    })


    test("should redirect to empTable if user is authenticated", () => {
        localStorage.setItem("credential", "token");
        localStorage.setItem("userInfo", JSON.stringify({ name: "Rakshit" }));
        const mockNavigate = vi.fn();

        render(
            <MemoryRouter>
                <AuthRoute navigate={mockNavigate}>
                    <div>Protected Content</div>
                </AuthRoute>
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith("/empTable");

    })
})