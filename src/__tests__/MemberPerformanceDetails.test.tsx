import PerformanceDetails from "@/app/components/UI/PerformanceDetails";
import MemberPerformanceDetails from "@/app/member-list/[accountId]/[date]/page";
import { IMemberPerformanceIssueHistory } from "@/types/types";
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


describe("Member Performance Details", () => {

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


})