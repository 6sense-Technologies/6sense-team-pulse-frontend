import AddMemberDrawer from '@/app/components/UI/AddMemberDrawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Mock dependencies
jest.mock('next/navigation', () => {
    return {
        useRouter: (): { push: jest.Mock } => {
            return {
                push: jest.fn(),
            }
        },
    }
});

jest.mock('axios', () => {
    return {
        get: jest.fn().mockResolvedValue({ data: { designations: ['Developer'], projects: ['Project A'] } }),
        post: jest.fn().mockResolvedValue({ data: {} }),
    }
});

const mockOnClose = jest.fn();
const mockRefetch = jest.fn();
const queryClient = new QueryClient();

const renderComponent = (isOpen = true): ReturnType<typeof render> => {
    return render(
        <QueryClientProvider client={queryClient}>
            <AddMemberDrawer isOpen={isOpen} onClose={mockOnClose} refetch={mockRefetch} />
        </QueryClientProvider>
    )
};

describe('AddMemberDrawer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the drawer when open', () => {
        renderComponent(true);
        expect(screen.getByText(/Add Member/i)).toBeInTheDocument();
        expect(screen.getByText(/Get started by filling in the information/i)).toBeInTheDocument();
    });

    it('should close the drawer when clicking the close button', () => {
        renderComponent(true);
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should display validation errors if required fields are empty on submit', async () => {
        renderComponent(true);
        fireEvent.click(screen.getByRole('button', { name: /create/i }));
        await waitFor(() => {
            expect(screen.getByText(/Jira\/Trello is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Designation is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Project is required/i)).toBeInTheDocument();
        });
    });

    it('should close the drawer when the escape key is pressed', () => {
        renderComponent(true);
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close the drawer when clicking outside', () => {
        renderComponent(true);
        fireEvent.mouseDown(document);
        expect(mockOnClose).toHaveBeenCalled();
    });
});
