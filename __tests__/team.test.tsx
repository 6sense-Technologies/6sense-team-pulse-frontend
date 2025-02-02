import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProjectCreate from '../src/app/(dashboards)/projects/create/page';
import { GetTools, CreateProject } from '../api/projects/projectApi';

// Mock external libraries
jest.mock('lucide-react', () => ({
  Circle: () => <svg data-testid="circle-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../src/components/BaseInput', () => ({
  BaseInput: () => <input data-testid="base-input" />,
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

jest.mock('../src/app/(dashboards)/projects/create/_components/ToolDropdown', () => () => (
  <div data-testid="tool-dropdown">Mock Tool Dropdown</div>
));

jest.mock('../src/app/(dashboards)/projects/create/_components/WorkspaceURL', () => () => (
  <div data-testid="workspace-url">Mock Workspace URL</div>
));

// Mock API functions
jest.mock('../api/projects/projectApi', () => ({
  GetTools: jest.fn(),
  CreateProject: jest.fn(),
}));

const queryClient = new QueryClient();

describe('ProjectCreate Page', () => {
  beforeEach(() => {
    // Mock GetTools API response
    (GetTools as jest.Mock).mockResolvedValue([{ toolName: 'Tool 1', toolUrl: 'https://tool1.com' }]);

    // Mock CreateProject API response
    (CreateProject as jest.Mock).mockResolvedValue({ message: 'Project created successfully' });

    render(
      <QueryClientProvider client={queryClient}>
        <ProjectCreate />
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

  it('renders the tool dropdown and workspace URL for the first tool', () => {
    const toolDropdown = screen.getByTestId('tool-dropdown');
    const workspaceUrl = screen.getByTestId('workspace-url');
    expect(toolDropdown).toBeInTheDocument();
    expect(workspaceUrl).toBeInTheDocument();
  });

  it('renders the Add Tool button', () => {
    const addToolButton = screen.getByText(/Add Tool/i);
    expect(addToolButton).toBeInTheDocument();
  });

  it('renders the Create Project button', () => {
    const createProjectButton = screen.getByText(/Create Project/i);
    expect(createProjectButton).toBeInTheDocument();
  });

  describe('Tool Interactions', () => {
    it('should add a new tool when Add Tool button is clicked', () => {
      const addToolButton = screen.getByText(/Add Tool/i);
      fireEvent.click(addToolButton);

      const toolDropdown = screen.getAllByTestId('tool-dropdown');
      expect(toolDropdown.length).toBe(2);  // One for the initial tool and one added
    });
  });
});
