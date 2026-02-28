import { ThemeProvider } from "./ThemeContext";
import { HelmetProvider } from "react-helmet-async";
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard title', () => {
  render(<HelmetProvider><ThemeProvider><App /></ThemeProvider></HelmetProvider>);
  const titleElement = screen.getByText(/WordPress React Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});
