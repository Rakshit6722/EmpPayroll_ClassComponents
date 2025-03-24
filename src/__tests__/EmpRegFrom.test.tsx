import EmpRegForm from "../pages/EmpRegForm";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Employee Register Form Unit Tests", () => {
    test("should render the component", () => {
        render(<EmpRegForm />);
        const empRegForm = screen.getByText(/employee payroll form/i);
        expect(empRegForm).toBeInTheDocument();
    });

    test("should render the form with input fields", () => {
        render(<EmpRegForm />);
        const form = screen.getByTestId("form");
        expect(form).toBeInTheDocument();
        const inputFields = screen.getAllByTestId("input-fields");
        expect(inputFields).toHaveLength(17);
    });

    test("name input field should accept input", () => {
        render(<EmpRegForm />);
        const nameInput = screen.getByRole("textbox", { name: /name/i });
        fireEvent.change(nameInput, { target: { value: "Rakshit" } });
        expect(nameInput).toHaveValue("Rakshit");
    });

  
});
