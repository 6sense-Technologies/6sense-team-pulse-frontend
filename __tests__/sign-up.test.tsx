import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUp from '../src/app/(auth)/sign-up/page';
import { useSession} from 'next-auth/react';

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), 
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

// Mock dependencies
jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

// Mock Eye and EyeOff components
jest.mock('lucide-react', () => ({
  Eye: jest.fn(() => <div data-testid="mock-eye">Mock Eye</div>),
  EyeOff: jest.fn(() => <div data-testid="mock-eye-off">Mock EyeOff</div>),
}));


jest.mock('../helpers/Auth/authApi', () => ({
  handleBasicSignup: jest.fn(),
}));

jest.mock('../src/components/loader', () => {
  return jest.fn(() => <div data-testid="mock-loader">Mock Loader</div>);
});

jest.mock('../src/app/(auth)/_components/authPageHeader', () => {
  return jest.fn(({ title, subTitle }) => (
    <div data-testid="mock-auth-header">
      <h2>{title}</h2>
      <p>{subTitle}</p>
    </div>
  ));
});

const queryClient = new QueryClient();

describe('SignUp Page', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ status: 'unauthenticated', data: null });

    render(
      <QueryClientProvider client={queryClient}>
        <SignUp />
      </QueryClientProvider>
    );
  });

  it('renders the correct subheading', async () => {
    const subheading = await screen.findByText(/You are one click away/i);
    expect(subheading).toBeInTheDocument();
  });

  it('renders the full name input', () => {
    const fullNameInput = screen.getByPlaceholderText('Enter your full name');
    expect(fullNameInput).toBeInTheDocument();
  });

  it('renders the email input', () => {
    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toBeInTheDocument();
  });

  it('renders the password input', () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
  });

  it('renders the sign up button', () => {
    const signUpButton = screen.getByRole('button', { name: /Sign up/i });
    expect(signUpButton).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted with empty fields', async () => {
    const signUpButton = screen.getByRole('button', { name: /Sign up/i });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText(/Full Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

});