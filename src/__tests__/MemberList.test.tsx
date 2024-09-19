import MemberList from "@/app/member-list/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation"; // Import the hook

// Mock the useSearchParams hook
jest.mock("next/navigation", () => {
    return {
        useSearchParams: jest.fn(),
    }
});

// Mock axios response
jest.mock("axios", () => {
    return {
        get: jest.fn().mockResolvedValue({ data: { users: [], totalUsers: 0 } }),
    }
});

describe("MemberList Component - Basic Rendering", () => {
    beforeEach(() => {
        // Mock the implementation of useSearchParams to return a search parameter
        (useSearchParams as jest.Mock).mockImplementation(() => {
            return {
                get: jest.fn((key) => {
                    if (key === 'page') return "1";
                    return null;
                }),
            }
        });
    });

    it("should render page title and members section", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemberList />
            </QueryClientProvider>
        );

        // Use getAllByText to check how many "Members" are found
        const membersElements = screen.getAllByText("Members");

        // Log how many elements were found for debugging
        console.log("Number of elements with text 'Members':", membersElements.length);

        // Check if at least one page title is rendered
        const pageTitle = screen.getByText("Members", { selector: "h1, h2, h3, h4" }); // Adjust the selector as needed
        expect(pageTitle).toBeInTheDocument();

        // Check for the members section title
        const membersTitle = screen.getByText("All Members");
        expect(membersTitle).toBeInTheDocument();
    });

});
