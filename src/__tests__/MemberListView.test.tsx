import MemberListView from "@/app/components/UI/MemberListView";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

// Mock the router
jest.mock("next/navigation", () => {
    return {
        useRouter: jest.fn(),
        useSearchParams: jest.fn(),
    }
});

const mockPush = jest.fn();
const mockRefetch = jest.fn();

describe("MemberListView", () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    const mockMembers = [
        {
            _id: "1",
            accountId: "account1",
            displayName: "John Doe",
            emailAddress: "john.doe@example.com",
            avatarUrls: "/avatar1.png",
            currentPerformance: 85.5,
            designation: "Developer",
        },
        {
            _id: "2",
            accountId: "account2",
            displayName: "Jane Smith",
            emailAddress: "jane.smith@example.com",
            avatarUrls: "",
            currentPerformance: 90.0,
            designation: "Designer",
        },
    ];

    const mockTotalCountAndLimit = {
        totalCount: 20,
        size: 10,
    };

    it("renders the table with member data", () => {
        render(
            <MemberListView
                members={mockMembers}
                refetch={mockRefetch}
                totalCountAndLimit={mockTotalCountAndLimit}
            />
        );

        // Check if column headers are rendered
        expect(screen.getByText(/PHOTO/i)).toBeInTheDocument();
        expect(screen.getByText(/NAME/i)).toBeInTheDocument();
        expect(screen.getByText(/EMAIL/i)).toBeInTheDocument();
        expect(screen.getByText(/DESIGNATION/i)).toBeInTheDocument();
        expect(screen.getByText(/OVERALL PERFORMANCE/i)).toBeInTheDocument();
        expect(screen.getByText(/ACTION/i)).toBeInTheDocument();

        // Check if members data is rendered
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
        expect(screen.getByText("Developer")).toBeInTheDocument();
        expect(screen.getByText("85.50%")).toBeInTheDocument();

        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
        expect(screen.getByText("Designer")).toBeInTheDocument();
        expect(screen.getByText("90.00%")).toBeInTheDocument();
    });

    it("renders the pagination component correctly", () => {
        render(
            <MemberListView
                members={mockMembers}
                refetch={mockRefetch}
                totalCountAndLimit={mockTotalCountAndLimit}
            />
        );

        expect(
            screen.getByText(`Showing ${mockMembers.length} out of ${mockTotalCountAndLimit.totalCount} results`)
        ).toBeInTheDocument();
    });

    it("calls refetch and updates URL when page is changed", () => {
        render(
            <MemberListView
                members={mockMembers}
                refetch={mockRefetch}
                totalCountAndLimit={mockTotalCountAndLimit}
            />
        );

        const nextPageButton = screen.getByRole("button", { name: /2/i });
        fireEvent.click(nextPageButton);

        expect(mockPush).toHaveBeenCalledWith("/member-list?page=2");
        expect(mockRefetch).toHaveBeenCalled();
    });
});
