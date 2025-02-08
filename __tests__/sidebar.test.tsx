import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../src/components/ui/sidebar';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../src/components/loader', () => jest.fn(() => <div data-testid="loader">Loader</div>));
jest.mock('../src/components/app-sidebar', () => jest.fn(() => <div data-testid="app-sidebar">AppSidebar</div>));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Bot: jest.fn(() => <div data-testid="icon-bot">Bot Icon</div>),
  Boxes: jest.fn(() => <div data-testid="icon-boxes">Boxes Icon</div>),
  Ellipsis: jest.fn(() => <div data-testid="icon-ellipsis">Ellipsis Icon</div>),
  Frame: jest.fn(() => <div data-testid="icon-frame">Frame Icon</div>),
  GalleryVerticalEnd: jest.fn(() => <div data-testid="icon-gallery-vertical-end">GalleryVerticalEnd Icon</div>),
  KeyRound: jest.fn(() => <div data-testid="icon-key-round">KeyRound Icon</div>),
  MessageSquareWarning: jest.fn(() => <div data-testid="icon-message-square-warning">MessageSquareWarning Icon</div>),
  SquareTerminal: jest.fn(() => <div data-testid="icon-square-terminal">SquareTerminal Icon</div>),
  Users: jest.fn(() => <div data-testid="icon-users">Users Icon</div>),
}));

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

describe('Sidebar', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });



  it('renders SidebarRail and toggles the sidebar when clicked', () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
      data: { isVerified: true, hasOrganization: true },
    });

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    );

    const rail = screen.getByRole('button', { name: /toggle sidebar/i });
    fireEvent.click(rail);

    // Add assertions to verify the sidebar state change
  });

  it('renders SidebarHeader, SidebarFooter, SidebarSeparator, and SidebarContent', () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
      data: { isVerified: true, hasOrganization: true },
    });

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader data-testid="header" />
          <SidebarFooter data-testid="footer" />
          <SidebarSeparator data-testid="separator" />
          <SidebarContent data-testid="content" />
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('separator')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders SidebarGroup, SidebarGroupLabel, SidebarGroupAction, and SidebarGroupContent', () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
      data: { isVerified: true, hasOrganization: true },
    });

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarGroup data-testid="group">
            <SidebarGroupLabel data-testid="group-label" />
            <SidebarGroupAction data-testid="group-action" />
            <SidebarGroupContent data-testid="group-content" />
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByTestId('group')).toBeInTheDocument();
    expect(screen.getByTestId('group-label')).toBeInTheDocument();
    expect(screen.getByTestId('group-action')).toBeInTheDocument();
    expect(screen.getByTestId('group-content')).toBeInTheDocument();
  });

  it('renders SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge, SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, and SidebarMenuSubItem', () => {
    (useSession as jest.Mock).mockReturnValue({
      status: 'authenticated',
      data: { isVerified: true, hasOrganization: true },
    });

    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarMenu data-testid="menu">
            <SidebarMenuItem data-testid="menu-item">
              <SidebarMenuButton data-testid="menu-button" />
              <SidebarMenuAction data-testid="menu-action" />
              <SidebarMenuBadge data-testid="menu-badge" />
              <SidebarMenuSkeleton data-testid="menu-skeleton" />
              <SidebarMenuSub data-testid="menu-sub">
                <SidebarMenuSubItem data-testid="menu-sub-item">
                  <SidebarMenuSubButton data-testid="menu-sub-button" />
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    );

    expect(screen.getByTestId('menu')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item')).toBeInTheDocument();
    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('menu-action')).toBeInTheDocument();
    expect(screen.getByTestId('menu-badge')).toBeInTheDocument();
    expect(screen.getByTestId('menu-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('menu-sub')).toBeInTheDocument();
    expect(screen.getByTestId('menu-sub-item')).toBeInTheDocument();
    expect(screen.getByTestId('menu-sub-button')).toBeInTheDocument();
  });
});