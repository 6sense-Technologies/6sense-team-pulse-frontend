import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import OrganizationDetails from '../src/app/(auth)/sign-up/create-organization/page';
import { handleOrganizationDetails } from '../helpers/Auth/authApi';

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
  useSession: jest.fn(),
}));

jest.mock('../helpers/Auth/authApi', () => ({
  handleOrganizationDetails: jest.fn(),
}));


jest.mock('../src/components/pageHeading', () => {
  const MockPageHeading = () => (
    <h1 data-testid="page-heading">Mock Page Heading</h1>
  );
  MockPageHeading.displayName = 'MockPageHeading';
  return MockPageHeading;
});

jest.mock('../src/components/PageTitle', () => {
  const MockPageTitle = () => <title>Mock Page Title</title>;
  MockPageTitle.displayName = 'MockPageTitle';
  return MockPageTitle;
});

jest.mock('../src/components/ui/avatar', () => ({
  AvatarImage: () => <img data-testid="avatar-image" alt="Avatar" src="/path/to/avatar.jpg" width={50} height={50} />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../src/components/ui/sidebar', () => {
  const originalModule = jest.requireActual('../src/components/ui/sidebar');
  return {
    ...originalModule,
    SidebarTrigger: () => (
      <div data-testid="sidebar-trigger">Mock Sidebar Trigger</div>
    ),
  };
});

const queryClient = new QueryClient();

describe('OrganizationDetails Page', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({ status: 'authenticated', data: { user: { name: 'John Doe' }, isVerified: true, hasOrganization: false } });

    render(
      <QueryClientProvider client={queryClient}>
        <OrganizationDetails />
      </QueryClientProvider>
    );
  });


  it('renders the organization name input', () => {
    const orgNameInput = screen.getByPlaceholderText('Enter your organization name');
    expect(orgNameInput).toBeInTheDocument();
  });

  it('renders the domain input', () => {
    const domainInput = screen.getByPlaceholderText('Domain');
    expect(domainInput).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    const submitButtons = screen.getAllByRole('button', { name: /Submit/i });
    expect(submitButtons.length).toBeGreaterThan(0);
  });


  it('submits the form with valid data', async () => {
    const orgNameInput = screen.getByPlaceholderText('Enter your organization name');
    const domainInput = screen.getByPlaceholderText('Domain');
    const submitButtons = screen.getAllByRole('button', { name: /Submit/i });

    fireEvent.change(orgNameInput, { target: { value: 'Test Organization' } });
    fireEvent.change(domainInput, { target: { value: 'testorganization' } });
    fireEvent.click(submitButtons[0]);

    await waitFor(() => {
      expect(handleOrganizationDetails).toHaveBeenCalledWith({
        organizationName: 'Test Organization',
        domainName: 'testorganization',
      });
    });
  });


});