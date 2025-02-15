import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignIn from '../src/app/(auth)/sign-in/page';
import { useSession } from 'next-auth/react';

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
    }))})});

// Mock dependencies
jest.mock('../src/components/loader', () => {
  return jest.fn(() => <div data-testid="mock-loader">Mock Loader</div>);
});

jest.mock('../src/app/(auth)/sign-in/_components/invalidErrorBanner', () => {
  return jest.fn(() => <div data-testid="mock-invalid-error-banner">Mock Invalid Error Banner</div>);
});

jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  })),
}));

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: jest.fn(),
  useSession: jest.fn(),
}));

jest.mock('next-auth/providers/google', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    id: 'google',
    name: 'Google',
    type: 'oauth',
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
  }))}));

// Mock Eye and EyeOff components
jest.mock('lucide-react', () => ({
  Eye: jest.fn(() => <div data-testid="mock-eye">Mock Eye</div>),
  EyeOff: jest.fn(() => <div data-testid="mock-eye-off">Mock EyeOff</div>),
}));

// Mock Toaster component
jest.mock('../src/components/ui/toaster', () => ({
  Toaster: jest.fn(() => <div data-testid="mock-toaster">Mock Toaster</div>),
}));

// Mock comingSoonAlert function
jest.mock('../src/hooks/use-toast', () => ({
  toast: jest.fn(),
}));

const queryClient = new QueryClient();

describe('SignIn Page', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ status: 'unauthenticated', data: null });

    render(
      <QueryClientProvider client={queryClient}>
        <SignIn />
      </QueryClientProvider>
    );
  });

  it('renders the email input', () => {
    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toBeInTheDocument();
  });

  it('renders the password input', () => {
    const passwordInput = screen.getByPlaceholderText('Password');
    expect(passwordInput).toBeInTheDocument();
  });

  it('calls the comingSoonAlert function when the feature is accessed', () => {
    const { toast } = require('../src/hooks/use-toast');
    const someButton = screen.getByText('SSO'); // Replace with actual button text
    fireEvent.click(someButton);
    expect(toast).toHaveBeenCalledWith({
      title: 'Stay Tuned!',
      description: 'This feature is coming soon.',
    });
  });
});