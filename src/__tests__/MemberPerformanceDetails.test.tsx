import CommentDialog from "@/app/components/UI/CommentDialog";
import PerformanceDetails from "@/app/components/UI/PerformanceDetails";
import Threads from "@/app/components/UI/Threads";
import MemberPerformanceDetails from "@/app/member-list/[accountId]/[date]/page";
import { IMemberPerformanceIssueHistory } from "@/types/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

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

jest.mock("../../node_modules/@tanstack/react-query", () => {
    return {
        useQuery: jest.fn(), // mock the named export useQuery
        data: undefined,
        isFetching: true,
    }
});


describe("Member Performance Details", () => {

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it("should have the page title", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemberPerformanceDetails />
            </QueryClientProvider>
        );

        expect(screen.getByText("Performance Details")).toBeInTheDocument();
    });

    it("should have the bug reported", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemberPerformanceDetails />
            </QueryClientProvider>
        );

        expect(screen.getByText("Bugs Reported: 0")).toBeInTheDocument();
    });

    it("should have the All comments title", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <Threads comments={[]} />
            </QueryClientProvider>
        );

        expect(screen.getByText("All Comments")).toBeInTheDocument();
    });



    it("comment dialog should render correctly", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <CommentDialog isOpen={true} onClose={function (): void {
                    throw new Error("Function not implemented.");
                }} accountId={""} currentDate={""} commentAdded={function (): void {
                    throw new Error("Function not implemented.");
                }} />
            </QueryClientProvider>
        );

        expect(screen.getByText("Comment")).toBeInTheDocument();
        expect(screen.getByTestId("post")).toBeInTheDocument();
        expect(screen.getByTestId("Cancel")).toBeInTheDocument();
    });

    it("should call onClose when Cancel button is clicked", () => {
        const onClose = jest.fn();
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <CommentDialog isOpen={true} onClose={onClose} accountId={""} currentDate={""} commentAdded={function (): void {
                    throw new Error("Function not implemented.");
                }} />
            </QueryClientProvider>
        );

        const cancelButton = screen.getByTestId("Cancel");
        fireEvent.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
    });

    it("should show validation error when submitting empty comment", async () => {
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <CommentDialog isOpen={true} accountId={""} currentDate={""} commentAdded={function (): void {
                    throw new Error("Function not implemented.");
                }} onClose={function (): void {
                    throw new Error("Function not implemented.");
                }} />
            </QueryClientProvider>
        );

        const postButton = screen.getByTestId("post");
        fireEvent.click(postButton);

        expect(await screen.findByText("Comment is required!")).toBeInTheDocument();
    });

    it("should show not found when here is no data", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <PerformanceDetails data={undefined} date={""} />
            </QueryClientProvider>
        );

        expect(screen.getByText("No Data Found!")).toBeInTheDocument();
    });

    it("should show the correct table columns", () => {
        const mockPerformanceData: IMemberPerformanceIssueHistory = {
            userName: "John Doe",
            accountId: "12345",
            noOfBugs: 5,
            comment: "Overall good performance, but issues with bug handling.",
            comments: [],
            issues: [
                {
                    serialNumber: 1,
                    issueType: "Bug",
                    issueId: "BUG-101",
                    issueStatus: "Open",
                    planned: false,
                    issueSummary: "Unexpected error on login page",
                    link: "https://issue-tracker.com/BUG-101",
                },
                {
                    serialNumber: 2,
                    issueType: "Bug",
                    issueId: "BUG-102",
                    issueStatus: "Closed",
                    planned: true,
                    issueSummary: "UI misalignment in dashboard",
                    link: "https://issue-tracker.com/BUG-102",
                },
            ],
        };
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <PerformanceDetails data={mockPerformanceData} date={"2024-10-08"} />
            </QueryClientProvider>
        );

        // Check if column headers are rendered
        expect(screen.getByText("NO.")).toBeInTheDocument();
        expect(screen.getByText("DATE")).toBeInTheDocument();
        expect(screen.getByText("USERNAME")).toBeInTheDocument();
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("TYPE")).toBeInTheDocument();
        expect(screen.getByText("STATUS")).toBeInTheDocument();
        expect(screen.getByText("PLAN STATUS")).toBeInTheDocument();
        expect(screen.getByText("LINKED IDS")).toBeInTheDocument();
    });


    it("should display the correct issue data in the table", () => {
        const mockPerformanceData: IMemberPerformanceIssueHistory = {
            userName: "John Doe",
            accountId: "12345",
            noOfBugs: 5,
            comment: "Overall good performance, but issues with bug handling.",
            comments: [
                {
                    comment: "Fixed the login bug quickly.",
                    timestamp: "2024-10-12T10:38:17.972Z"
                },
                {
                    comment: "Still facing some UI misalignment issues.",
                    timestamp: "2024-10-13T15:23:11.972Z"
                }
            ],
            issues: [
                {
                    serialNumber: 1,
                    issueType: "Bug",
                    issueId: "BUG-101",
                    issueStatus: "Open",
                    planned: false,
                    issueSummary: "Unexpected error on login page",
                    link: "https://issue-tracker.com/BUG-101"
                },
                {
                    serialNumber: 2,
                    issueType: "Task",
                    issueId: "BUG-102",
                    issueStatus: "Closed",
                    planned: true,
                    issueSummary: "UI misalignment in dashboard",
                    link: "https://issue-tracker.com/BUG-102"
                }
            ]
        };

        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>

                <PerformanceDetails data={mockPerformanceData} date={"2024-10-08"} />
            </QueryClientProvider>
        );

        // Check if issue data is rendered
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("BUG-101")).toBeInTheDocument();
        expect(screen.getByText("Bug")).toBeInTheDocument();
        expect(screen.getByText("Open")).toBeInTheDocument();
        expect(screen.getByText("Unexpected error on login page")).toBeInTheDocument();
        expect(screen.getByText("https://issue-tracker.com/BUG-101")).toBeInTheDocument();
    });
})

describe('Threads component', () => {

    beforeAll(() => {
        // Mocking toLocaleTimeString to ensure consistent formatting across environments
        jest.spyOn(Date.prototype, 'toLocaleTimeString').mockImplementation(() => { return '05:38 AM' });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });


    const queryClient = new QueryClient();

    it("should have the All Comments title", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Threads comments={[]} />
            </QueryClientProvider>
        );

        expect(screen.getByText("All Comments")).toBeInTheDocument();
    });

    it('should render all comments with formatted time', () => {
        const comments = [
            { comment: 'First comment', timestamp: '2024-10-14T05:38:17.972Z' },
        ];

        render(
            <QueryClientProvider client={queryClient}>
                <Threads comments={comments} />
            </QueryClientProvider>
        );

        expect(screen.getByText('First comment')).toBeInTheDocument();
        expect(screen.getByText('05:38 AM')).toBeInTheDocument();
    });
});