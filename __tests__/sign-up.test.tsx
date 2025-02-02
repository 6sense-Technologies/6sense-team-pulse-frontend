import '@testing-library/jest-dom';
import { render, screen} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignUp from '@/app/(auth)/sign-up/page';
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

// Mock AuthPageHeader
jest.mock('../src/app/(auth)/_components/authPageHeader', () => {
    return jest.fn(({ title, subTitle }) => (
      <div data-testid="mock-auth-header">
        <h2>{title}</h2>
        <p>{subTitle}</p>
      </div>
    ));
  });
  
  // Mock NextAuth
  jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
    useSession: jest.fn(),
  }));
  
// ✅ Mock Auth API Functions
jest.mock("../api/Auth/authApi", () => ({
    handleBasicSignup: jest.fn(),
    handleOtp: jest.fn(),
    handleOrganizationDetails: jest.fn(),
    handleResendOTP: jest.fn(),
  }));

  const queryClient = new QueryClient();
  
  describe("SignUp Page", () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated", data: null });
  
      render(
        <QueryClientProvider client={queryClient}>
          <SignUp />
        </QueryClientProvider>
      );
    });
  
  
    it("renders the correct subheading", async () => {
      const subheading = await screen.findByText(/You are one click away/i);
      expect(subheading).toBeInTheDocument();
    });

  
  

  
  });
