import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardType from "./CardType";

describe("CardType", () => {
  test("rozpoznaje Visa (4xxx)", () => {
    render(<CardType />);
    const input = screen.getByTestId("card-input");

    fireEvent.change(input, { target: { value: "4123456789012345" } });

    expect(screen.getByTestId("card-type")).toHaveTextContent(/Visa/);
  });

  test("rozpoznaje MasterCard (51-55xx)", () => {
    render(<CardType />);
    const input = screen.getByTestId("card-input");

    fireEvent.change(input, { target: { value: "5123456789012345" } });

    expect(screen.getByTestId("card-type")).toHaveTextContent(/MasterCard/);
  });

  test("rozpoznaje American Express (34/37xx)", () => {
    render(<CardType />);
    const input = screen.getByTestId("card-input");

    fireEvent.change(input, { target: { value: "341234567890123" } });

    expect(screen.getByTestId("card-type")).toHaveTextContent(
      /American Express/
    );
  });

  test("waliduje poprawną kartę Visa (Luhn)", () => {
    render(<CardType />);
    const input = screen.getByTestId("card-input");

    fireEvent.change(input, { target: { value: "4111111111111111" } });

    expect(screen.getByTestId("valid")).toBeInTheDocument();
  });

  test("odrzuca niepoprawną kartę", () => {
    render(<CardType />);
    const input = screen.getByTestId("card-input");

    fireEvent.change(input, { target: { value: "4111111111111112" } });

    expect(screen.getByTestId("error")).toHaveTextContent(/Luhn/);
  });

  test("formatuje z spacjami", () => {
    render(<CardType />);
    const input = screen.getByTestId("card-input");

    fireEvent.change(input, { target: { value: "4111111111111111" } });

    expect(input).toHaveValue("4111 1111 1111 1111");
  });
});
