import '@testing-library/jest-dom';
import { render, screen} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import OrganizationDetails from '../src/app/(auth)/sign-up/create-organization/page';

// Mock dependencies
jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: jest.fn(),
}));

jest.mock('../api/Auth/authApi', () => ({
  handleOrganizationDetails: jest.fn(),
}));

// Mock next/image to avoid the static import requirement
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt="mock logo" />,
}));

jest.mock('../src/components/ButtonComponent', () => ({
  Button: ({ children, ...props }: { children: React.ReactNode }) => <button {...props}>{children}</button>,
}));

jest.mock('../src/components/BaseInput', () => ({
  BaseInput: ({ name, control, ...props }: { name: string; control: any; [key: string]: any }) => <input {...props} />,
}));

const queryClient = new QueryClient();

describe('OrganizationDetails Component', () => {
  beforeEach(() => {
    // Mock session
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
      data: { user: { name: 'Test User', accessToken: 'mock-token' }, isVerified: true, hasOrganization: false },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <OrganizationDetails />
      </QueryClientProvider>
    );
  });

  it('renders the title and subtitle', () => {
    expect(screen.getByText('Organization Details')).toBeInTheDocument();
    expect(screen.getByText('Provide your organization details to get started')).toBeInTheDocument();
  });








}); 
