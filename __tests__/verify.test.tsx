import '@testing-library/jest-dom';
import { render, screen} from '@testing-library/react';
import Verify from '../src/app/(auth)/sign-up/verification/page';
import { useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(),
}));
jest.mock('../src/components/loader', () => {
    return jest.fn(() => <div data-testid="mock-loader">Mock Loader</div>);
  });

  
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

const queryClient = new QueryClient();

describe('Verify Component', () => {
  beforeEach(() => {
    // Mock session
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
      data: { isVerified: false, hasOrganization: false },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Verify />
      </QueryClientProvider>
    );
  });

  it('renders the title and subtitle', () => {
    const title = screen.getByText(/Verify Email/i);
    const subTitle = screen.getByText(/We sent a six digit code/i);

    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });


});
