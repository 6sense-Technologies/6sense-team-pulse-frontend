import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignIn from '@/app/(auth)/sign-in/page';
import { useSession } from 'next-auth/react';

// Keep all your existing mocks
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
  })),
}));

jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text', placeholder: 'example@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: jest.fn(() => ({
      email: 'test@example.com',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    })),
  })),
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { tokens: { access_token: 'mock-access-token', refresh_token: 'mock-refresh-token' } } })),
}));

jest.mock('next/image', () => (props: any) => {
  return <img {...props} />;
});

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


  it('renders the subheader', () => {
    expect(screen.getByText(/You are one click away/i)).toBeInTheDocument();
    expect(screen.getByText(/from being efficient/i)).toBeInTheDocument();
  });


  it('renders the Sign In button', () => {
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });


  it('renders the Google logo', () => {
    expect(screen.getByAltText(/googleLogo/i)).toBeInTheDocument();
  });

  it('renders the Facebook logo', () => {
    expect(screen.getByAltText(/facebookLogo/i)).toBeInTheDocument();
  });

  it('renders the Apple logo', () => {
    expect(screen.getByAltText(/appleLogo/i)).toBeInTheDocument();
  });

});
