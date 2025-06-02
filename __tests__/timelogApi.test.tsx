import axios from "axios";
import {
  GetTimelogListUnreported,
  GetTimelogListReported,
  GetProjectList,
  GetWorksheetList,
  CreateReportedData,
  GetReportedworksheetList,
  RemoveWorksheetData,
} from "../helpers/timelogs/timelogApi";
import { TEMP_BACKEND_URI } from "../globalConstants";

// Mock axios
jest.mock("axios");
const mockedAxios = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<typeof axios>;

// Mock session
const mockSession = {
  data: {
    accessToken: "mock-token",
    expires: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  },
  update: jest.fn(),
};

describe("timelogApi", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GetTimelogListUnreported", () => {
    const mockParams = {
      page: 1,
      limit: 10,
      formattedDate: "2024-03-20",
      sort: "newest",
    };

    it("should fetch unreported timelogs successfully", async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: "1",
              description: "Test log",
              startTime: "2024-03-20T09:00:00Z",
              endTime: "2024-03-20T10:00:00Z",
            },
          ],
          paginationMetadata: { totalCount: 1 },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetTimelogListUnreported(mockParams, mockSession);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/timelog/unreported?page=1&limit=10&date=2024-03-20&sort-order=newest`,
        {
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
            "Timezone-Region": "Asia/Dhaka",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle session expiration", async () => {
      const expiredSession = {
        ...mockSession,
        data: {
          ...mockSession.data,
          expires: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
      };

      const newTokenResponse = { data: { accessToken: "new-token" } };
      const mockResponse = { data: { data: [], paginationMetadata: { totalCount: 0 } } };

      mockedAxios.get
        .mockResolvedValueOnce(newTokenResponse)
        .mockResolvedValueOnce(mockResponse);

      await GetTimelogListUnreported(mockParams, expiredSession);

      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/auth/session");
    });
  });

  describe("GetTimelogListReported", () => {
    const mockParams = {
      page: 1,
      limit: 10,
      startDate: "2024-03-20",
      endDate: "2024-03-21",
      sort: "newest",
    };

    it("should fetch reported timelogs successfully", async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: "1",
              description: "Reported log",
              projectName: "Test Project",
              worksheetId: "ws1",
            },
          ],
          paginationMetadata: { totalCount: 1 },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetTimelogListReported(mockParams, mockSession);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/timelog/worksheet/list?page=1&limit=10&start-date=2024-03-20&end-date=2024-03-21&sort-order=newest`,
        {
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
            "Timezone-Region": "Asia/Dhaka",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("GetProjectList", () => {
    it("should fetch project list successfully", async () => {
      const mockResponse = {
        data: [
          { id: "p1", name: "Project 1" },
          { id: "p2", name: "Project 2" },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetProjectList(mockSession);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/projects/get-user-projects-by-organization`,
        {
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("GetWorksheetList", () => {
    const mockParams = {
      projectId: "p1",
      worksheetName: "Test Worksheet",
      formattedDate: "2024-03-20",
    };

    it("should fetch worksheet list successfully", async () => {
      const mockResponse = {
        data: [
          { id: "ws1", name: "Test Worksheet" },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetWorksheetList(mockParams, mockSession);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/timelog/worksheet/get-names?project-id=p1&name=Test Worksheet&date=2024-03-20`,
        {
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("CreateReportedData", () => {
    const mockData = {
      projectId: "p1",
      worksheetId: "ws1",
      timelogIds: ["1", "2"],
    };

    it("should create reported data successfully", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await CreateReportedData(mockData, mockSession);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/timelog/unreported/assign-to-project`,
        mockData,
        {
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("GetReportedworksheetList", () => {
    const mockParams = {
      page: 1,
      limit: 10,
      sort: "newest",
      searchText: "test",
    };
    const reportedId = "ws1";

    it("should fetch reported worksheet list successfully", async () => {
      const mockResponse = {
        data: {
          data: [
            {
              id: "1",
              description: "Test activity",
              startTime: "2024-03-20T09:00:00Z",
              endTime: "2024-03-20T10:00:00Z",
            },
          ],
          paginationMetadata: { totalCount: 1 },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetReportedworksheetList(mockParams, reportedId, mockSession);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/timelog/worksheet/ws1?page=1&limit=10&sort-order=newest&search=test`,
        {
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
            "Timezone-Region": "Asia/Dhaka",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("RemoveWorksheetData", () => {
    const mockData = {
      worksheetId: "ws1",
      timelogIds: ["1", "2"],
    };

    it("should remove worksheet data successfully", async () => {
      const mockResponse = {
        data: { success: true },
      };

      mockedAxios.delete.mockResolvedValueOnce(mockResponse);

      const result = await RemoveWorksheetData(mockData, mockSession);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/timelog/worksheet/remove-activities`,
        {
          data: mockData,
          headers: {
            Authorization: "Bearer mock-token",
            "Organization-Id": "67a317a25b672f01152f081a",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
