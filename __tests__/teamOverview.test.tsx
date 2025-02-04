import '@testing-library/jest-dom';
import { render, screen} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EfficiencyMemberDetails from '../src/app/(dashboards)/team/[id]/member-details/page'; // Adjust import as needed
import { GetIndividualOverview } from '../helpers/Team/teamApi'; // Adjust import as needed

// Mock external libraries
jest.mock('lucide-react', () => ({
  CalendarArrowDown: () => <svg data-testid="calendar-arrow-down-icon" />,
  CalendarCheck2: () => <svg data-testid="calendar-check-icon" />,
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ id: '123' }), // Mock useParams for the `id` parameter
useSearchParams: jest.fn().mockReturnValue({
    get: (key: string): string | null => (key === 'page' ? '1' : null),
}), // Mock useSearchParams for pagination
}));

jest.mock('../src/components/globalBreadCrumb', () => () => (
  <div data-testid="breadcrumb">Mock Breadcrumb</div>
));

jest.mock('../src/components/pageHeading', () => () => (
  <h1 data-testid="page-heading">Mock Page Heading</h1>
));

jest.mock('../src/components/PageTitle', () => () => (
  <title>Mock Page Title</title>
));

jest.mock('../src/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AvatarImage: () => <img data-testid="avatar-image" alt="Avatar" />,
  AvatarFallback: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../src/app/(dashboards)/team/[id]/member-details/_components/TeamDetailsTable', () => ({
  TeamDetailsTable: () => <div data-testid="team-details-table">Mock Team Table</div>,
}));

jest.mock('../src/app/(dashboards)/team/[id]/member-details/_components/customDatePicker', () => ({
  CustomDatePicker: () => <div data-testid="custom-date-picker">Mock Date Picker</div>,
}));

// Mock API functions
jest.mock('../api/Efficiency/teamApi', () => ({
  GetIndividualOverview: jest.fn(),
}));

const queryClient = new QueryClient();

describe('EfficiencyMemberDetails Page', () => {
  beforeEach(() => {
    // Mock GetIndividualOverview API response
    (GetIndividualOverview as jest.Mock).mockResolvedValue({
      userData: {
        avatarUrls: 'https://avatar.url',
        displayName: 'John Doe',
        designation: 'Software Engineer',
      },
      currentMonthScore: 0.85,
      lastMonthScore: 0.75,
      history: { data: [], count: 0 },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EfficiencyMemberDetails />
      </QueryClientProvider>
    );
  });

  it('renders the breadcrumb', () => {
    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
  });

  it('renders the page heading', () => {
    const pageHeading = screen.getByTestId('page-heading');
    expect(pageHeading).toBeInTheDocument();
  });

  it('renders the profile avatar', () => {
    const avatarImage = screen.getByTestId('avatar-image');
    expect(avatarImage).toBeInTheDocument();
  });

  it('renders the user details correctly', () => {
    const name = screen.getByText(/John Doe/i);
    const designation = screen.getByText(/Software Engineer/i);
    expect(name).toBeInTheDocument();
    expect(designation).toBeInTheDocument();
  });

  it('renders the Edit Profile button', () => {
    const editProfileButton = screen.getByText(/Edit Profile/i);
    expect(editProfileButton).toBeInTheDocument();
  });


});
