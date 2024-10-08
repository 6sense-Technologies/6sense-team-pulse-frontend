import DialogForm from "@/app/components/UI/DialogForm";
import MemberDetailListView from "@/app/components/UI/MemberDetailListView";
import { IIssueHistory } from "@/types/types";
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

describe("Member Detail List View", () => {

    it("renders the table with member data", () => {
        // Mock data for IIssueHistory
        const mockIssueHistory: IIssueHistory[] = [
            {
                _id: "1",
                issuesCount: {
                    notDone: { Task: 1, Bug: 2, Story: 3 },
                    done: { Task: 4, Bug: 5, Story: 6 },
                },
                date: "2024-10-08",
                taskCompletionRate: 80,
                userStoryCompletionRate: 90,
                overallScore: 85,
                comment: "Good performance",
                codeToBugRatio: 0.5,
                __v: 0,
            },
            {
                _id: "2",
                issuesCount: {
                    notDone: { Task: 0, Bug: 1, Story: 2 },
                    done: { Task: 3, Bug: 4, Story: 5 },
                },
                date: "2024-10-07",
                taskCompletionRate: 75,
                userStoryCompletionRate: 85,
                overallScore: 80,
                comment: "Needs improvement",
                codeToBugRatio: 0.6,
                __v: 0,
            },
        ];

        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <MemberDetailListView data={mockIssueHistory} totalCountAndLimit={{
                    totalCount: 10,
                    size: 10
                }} accountId={"712020:31e66020-f05d-42fb-82bc-a57e2e191eda"} />
            </QueryClientProvider>
        );

        // Check if column headers are rendered
        expect(screen.getByText("DATE")).toBeInTheDocument();
        expect(screen.getByText("TASKS")).toBeInTheDocument();
        expect(screen.getByText("BUGS")).toBeInTheDocument();
        expect(screen.getByText("STORIES")).toBeInTheDocument();
        expect(screen.getByText("CT")).toBeInTheDocument();
        expect(screen.getByText("CB")).toBeInTheDocument();
        expect(screen.getByText("CU")).toBeInTheDocument();
        expect(screen.getByText("TCR")).toBeInTheDocument();
        expect(screen.getByText("USCR")).toBeInTheDocument();
        expect(screen.getByText("CTBR")).toBeInTheDocument();
        expect(screen.getByText("SCORE")).toBeInTheDocument();
        expect(screen.getByText("COMMENT")).toBeInTheDocument();
        expect(screen.getByText("ACTION")).toBeInTheDocument();
    });

    it("should show the dialog box with bug report form", () => {
        const queryClient = new QueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <DialogForm isOpen={true} onClose={function (): void {
                    throw new Error("Function not implemented.");
                }} accountId={"712020:31e66020-f05d-42fb-82bc-a57e2e191eda"} currentDate={"2024-10-07"} />
            </QueryClientProvider>
        );

        expect(screen.getByText("No. Of Bug")).toBeInTheDocument();
        expect(screen.getByText("Token")).toBeInTheDocument();
        expect(screen.getByText("Comment")).toBeInTheDocument();
    })
});