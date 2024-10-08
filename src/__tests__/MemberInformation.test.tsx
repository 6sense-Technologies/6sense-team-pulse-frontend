import ConfirmDialog from "@/app/components/UI/ConfirmDialog";
import MemberDetail from "@/app/components/UI/MemberDetail";
import MemberInformation from "@/app/member-list/[accountId]/page";
import { IMemberDetail } from "@/types/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => {
    return {
        useSearchParams: jest.fn().mockReturnValue({
            get: jest.fn().mockImplementation((key) => {
                if (key === "page") return "1"; // Mock the "page" param
                return null;
            }),
        }),
        useParams: jest.fn().mockReturnValue({
            accountId: "123", // Mock a valid accountId
        }),
        useRouter: jest.fn().mockReturnValue({
            push: jest.fn(), // Mock the `push` function used for routing
            replace: jest.fn(),
            query: {}, // Mock other properties if necessary
            pathname: "/member-list/123",
        }),
    };
});


jest.mock("axios", () => {
    return {
        get: jest.fn().mockResolvedValue({
            data: {
                user: {
                    issueHistory: [],
                    totalIssueHistory: 0,
                },
            },
        }),
    };
});

describe("Member Information", () => {
    it("should have the page title", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemberInformation />
            </QueryClientProvider>
        );

        const title = screen.getByText("Member Information");
        expect(title).toBeInTheDocument();
    });

    it("should have the archive button", () => {
        const queryClient = new QueryClient();

        // Mocking data for MemberDetail with IMemberDetail type
        const mockData: IMemberDetail = {
            _id: "1",
            accountId: "123",
            displayName: "Test Member",
            emailAddress: "test@example.com",
            avatarUrls: "https://avatar.url",
            designation: "Developer",
            currentPerformance: 85,
            issueHistory: [
                {
                    _id: "issue1",
                    issuesCount: {
                        notDone: { Task: 2, Bug: 1, Story: 0 },
                        done: { Task: 5, Bug: 2, Story: 1 },
                    },
                    date: "2024-10-01",
                    taskCompletionRate: 90,
                    userStoryCompletionRate: 85,
                    overallScore: 88,
                    comment: "Great performance",
                    codeToBugRatio: 1.5,
                    __v: 0,
                },
            ],
            __v: 0,
            totalIssueHistory: 1,
            currentPage: 1,
            totalPages: 1,
            project: "Project Alpha"
        };

        render(
            <QueryClientProvider client={queryClient}>
                <MemberDetail
                    totalCountAndLimit={{ totalCount: 1, size: 10 }}
                    data={mockData}
                />
            </QueryClientProvider>
        );

        const archiveButton = screen.getByText("Archive");
        expect(archiveButton).toBeInTheDocument();
    });

    it("should have the name, email, avatar, project etc", () => {
        const queryClient = new QueryClient();

        // Mocking data for MemberDetail with IMemberDetail type
        const mockData: IMemberDetail = {
            _id: "1",
            accountId: "123",
            displayName: "Test Member",
            emailAddress: "test@example.com",
            avatarUrls: "https://avatar.url",
            designation: "Developer",
            currentPerformance: 85,
            issueHistory: [
                {
                    _id: "issue1",
                    issuesCount: {
                        notDone: { Task: 2, Bug: 1, Story: 0 },
                        done: { Task: 5, Bug: 2, Story: 1 },
                    },
                    date: "2024-10-01",
                    taskCompletionRate: 90,
                    userStoryCompletionRate: 85,
                    overallScore: 88,
                    comment: "Great performance",
                    codeToBugRatio: 1.5,
                    __v: 0,
                },
            ],
            __v: 0,
            totalIssueHistory: 1,
            currentPage: 1,
            totalPages: 1,
            project: "Project Alpha"
        };

        render(
            <QueryClientProvider client={queryClient}>
                <MemberDetail
                    totalCountAndLimit={{ totalCount: 1, size: 10 }}
                    data={mockData}
                />
            </QueryClientProvider>
        );

        const displayName = screen.getByText("Test Member");
        const emailAddress = screen.getByText("test@example.com");
        const designation = screen.getByText("Developer");
        const project = screen.getByText("Project Alpha");

        expect(displayName).toBeInTheDocument();
        expect(emailAddress).toBeInTheDocument();
        expect(designation).toBeInTheDocument();
        expect(project).toBeInTheDocument();
    });

    it("should show the dialog box with bug report form", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <ConfirmDialog isOpen={true} onClose={function (): void {
                    throw new Error("Function not implemented.");
                }} onConfirm={function (): void {
                    throw new Error("Function not implemented.");
                }} title={"Are you sure?"} />
            </QueryClientProvider>
        );

        expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    })
});