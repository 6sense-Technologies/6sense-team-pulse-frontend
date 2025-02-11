import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EfficiencyMemberDetails from '../src/app/(dashboards)/members/[id]/member-details/page';
import { GetIndividualOverview, GetIndividualTeamMember } from '../helpers/Team/teamApi';
import { SidebarProvider } from '@/components/ui/sidebar';

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
// Mock external libraries
jest.mock('lucide-react', () => ({
  CalendarArrowDown: () => <svg data-testid="calendar-arrow-down-icon" />,
  CalendarCheck2: () => <svg data-testid="calendar-check-icon" />,
  EllipsisVertical: () => <svg data-testid="ellipsis-vertical-icon" />,
}));;

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ id: '123' }), // Mock useParams for the `id` parameter
  useSearchParams: jest.fn().mockReturnValue({
    get: (key: string): string | null => (key === 'page' ? '1' : null),
  }), // Mock useSearchParams for pagination
}));

jest.mock('../src/components/globalBreadCrumb', () => {
  const MockBreadcrumb = () => (
    <div data-testid="breadcrumb">Mock Breadcrumb</div>
  );
  MockBreadcrumb.displayName = 'MockBreadcrumb';
  return MockBreadcrumb;
});

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

jest.mock('../src/app/(dashboards)/team/[id]/member-details/_components/TeamDetailsTable', () => ({
  TeamDetailsTable: () => <div data-testid="team-details-table">Mock Team Table</div>,
}));

jest.mock('../src/app/(dashboards)/team/[id]/member-details/_components/customDatePicker', () => ({
  CustomDatePicker: () => <div data-testid="custom-date-picker">Mock Date Picker</div>,
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

jest.mock('../src/components/emptyTableSkeleton', () => {
  const MockEmptyTableSkeleton = () => (
    <div data-testid="empty-table-skeleton">Mock Empty Table Skeleton</div>
  );
  MockEmptyTableSkeleton.displayName = 'MockEmptyTableSkeleton';
  return MockEmptyTableSkeleton;
});

jest.mock('../src/components/textSkeleton', () => {
  const MockTextSkeleton = () => (
    <div data-testid="text-skeleton">Mock Text Skeleton</div>
  );
  MockTextSkeleton.displayName = 'MockTextSkeleton';
  return MockTextSkeleton;
});

jest.mock('../src/components/summarySkeleton', () => {
  const MockSummarySkeleton = () => (
    <div data-testid="summary-skeleton">Mock Summary Skeleton</div>
  );
  MockSummarySkeleton.displayName = 'MockSummarySkeleton';
  return MockSummarySkeleton;
});

// Mock API functions
jest.mock('../helpers/Team/teamApi', () => ({
  GetIndividualOverview: jest.fn(),
  GetIndividualTeamMember: jest.fn(),
}));

const queryClient = new QueryClient();

describe('EfficiencyMemberDetails Page', () => {
  beforeEach(() => {
    // Mock GetIndividualOverview API response
    (GetIndividualOverview as jest.Mock).mockResolvedValue({
      history: {
        count: 10,
        data: [],
      },
    });

    // Mock GetIndividualTeamMember API response
    (GetIndividualTeamMember as jest.Mock).mockResolvedValue({
      userData: {
        avatarUrls: 'https://avatar.url',
        displayName: 'John Doe',
        designation: 'Software Engineer',
      },
      currentMonthScore: 0.85,
      lastMonthScore: 0.75,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <EfficiencyMemberDetails />
        </SidebarProvider>
      </QueryClientProvider>
    );
  });

  it('renders the breadcrumb', () => {
    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
  });




  it('renders the Edit Profile button', () => {
    const editProfileButton = screen.getByRole('button', { name: /Edit Profile/i });
    expect(editProfileButton).toBeInTheDocument();
  });



  it('renders the custom date picker', () => {
    const customDatePicker = screen.getByTestId('custom-date-picker');
    expect(customDatePicker).toBeInTheDocument();
  });



  it('renders the empty table skeleton', () => {
    const emptyTableSkeleton = screen.getByTestId('empty-table-skeleton');
    expect(emptyTableSkeleton).toBeInTheDocument();
  });

  it('renders the text skeleton', () => {
    const textSkeleton = screen.getByTestId('text-skeleton');
    expect(textSkeleton).toBeInTheDocument();
  });

  it('renders the summary skeleton', () => {
    const summarySkeleton = screen.getByTestId('summary-skeleton');
    expect(summarySkeleton).toBeInTheDocument();
  });
});