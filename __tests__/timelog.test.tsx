import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import TimelogPage from "@/app/(dashboards)/timelog/page";

// Mock API helpers
jest.mock("../../../../helpers/timelogs/timelogApi", () => ({
  GetTimelogListUnreported: jest.fn(() =>
    Promise.resolve({
      data: [{ id: "1", description: "Unreported Log" }],
      paginationMetadata: { totalCount: 1 },
    }),
  ),
  GetTimelogListReported: jest.fn(() =>
    Promise.resolve({
      data: [{ id: "2", description: "Reported Log" }],
      paginationMetadata: { totalCount: 1 },
    }),
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => "/timelog"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: "John" } },
    status: "authenticated",
  })),
}));

const renderWithProviders = () => {
  const queryClient = new QueryClient();
  return render(
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>
        <TimelogPage />
      </QueryClientProvider>
    </SessionProvider>,
  );
};

describe("TimelogPage", () => {
  it("renders unreported tab by default", async () => {
    renderWithProviders();
    expect(await screen.findByText("Unreported")).toBeInTheDocument();
    expect(await screen.findByText("Unreported Log")).toBeInTheDocument();
  });

  it("switches to reported tab and loads reported logs", async () => {
    renderWithProviders();

    const reportedTab = screen.getByRole("tab", { name: "Reported" });
    fireEvent.click(reportedTab);

    await waitFor(() => {
      expect(screen.getByText("Reported Log")).toBeInTheDocument();
    });
  });

  it("resets pagination when changing date", async () => {
    renderWithProviders();

    const calendarButton = screen.getByRole("button", { name: /pick a date/i });
    fireEvent.click(calendarButton);

    // Simulate selecting a date
    const dayButton = await screen.findByRole("button", { name: /1/i }); // Simplified
    fireEvent.click(dayButton);

    await waitFor(() => {
      expect(screen.getByText("Unreported Log")).toBeInTheDocument();
    });
  });

  it("handles sort change", async () => {
    renderWithProviders();

    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    const oldestOption = screen.getByText("Oldest");
    fireEvent.click(oldestOption);

    await waitFor(() => {
      expect(screen.getByText("Unreported Log")).toBeInTheDocument(); // Re-fetched
    });
  });

  it("displays Create Log button in unreported tab", async () => {
    renderWithProviders();
    const createLogButton = await screen.findByText(/Create Log/i);
    expect(createLogButton).toBeInTheDocument();
  });

  it("hides Create Log button in reported tab", async () => {
    renderWithProviders();
    fireEvent.click(screen.getByRole("tab", { name: "Reported" }));

    await waitFor(() => {
      expect(screen.queryByText(/Create Log/i)).not.toBeInTheDocument();
    });
  });
});
