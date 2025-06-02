import axios from "axios";
import {
  CreateReportedData,
  GetProjectList,
  GetReportedworksheetList,
  GetTimelogListReported,
  GetTimelogListUnreported,
  GetWorksheetList,
  RemoveWorksheetData,
} from "../helpers/timelogs/timelogApi";
import { TEMP_BACKEND_URI } from "../globalConstants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockSession = {
  data: {
    accessToken: "mockAccessToken",
    expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  },
  update: jest.fn(),
};

describe("worksheetApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GetTimelogListUnreported - should return data on success", async () => {
    const mockResponse = { data: [] };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await GetTimelogListUnreported({ page: 1, limit: 10, formattedDate: "2025-05-15", sort: "asc" }, mockSession);

    expect(result).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${TEMP_BACKEND_URI}/timelog/unreported?page=1&limit=10&date=2025-05-15&sort-order=asc`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mockAccessToken",
        }),
      }),
    );
  });

  it("GetProjectList - should return data on success", async () => {
    const mockResponse = { data: [] };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await GetProjectList(mockSession);

    expect(result).toEqual([]);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${TEMP_BACKEND_URI}/projects/get-user-projects-by-organization`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mockAccessToken",
        }),
      }),
    );
  });

  it("GetWorksheetList - should return data on success", async () => {
    const mockResponse = { data: ["worksheet1"] };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await GetWorksheetList(
      {
        projectId: "123",
        worksheetName: "May",
        formattedDate: "2025-05-15",
      },
      mockSession,
    );

    expect(result).toEqual(["worksheet1"]);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${TEMP_BACKEND_URI}/timelog/worksheet/get-names?project-id=123&name=May&date=2025-05-15`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mockAccessToken",
        }),
      }),
    );
  });

  it("CreateReportedData - should post data and return response", async () => {
    const mockResponse = { data: { success: true } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const data = { id: "1", project: "Demo" };
    const result = await CreateReportedData(data, mockSession);

    expect(result).toEqual({ success: true });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${TEMP_BACKEND_URI}/timelog/unreported/assign-to-project`,
      data,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer mockAccessToken",
        }),
      }),
    );
  });

  it("GetTimelogListReported - should return reported timelog data", async () => {
    const mockResponse = { data: ["log1"] };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await GetTimelogListReported(
      {
        page: 1,
        limit: 10,
        startDate: "2025-05-01",
        endDate: "2025-05-31",
        sort: "desc",
      },
      mockSession,
    );

    expect(result).toEqual(["log1"]);
  });

  it("GetReportedworksheetList - should return worksheet list for a report", async () => {
    const mockResponse = { data: ["ws1", "ws2"] };
    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await GetReportedworksheetList(
      {
        page: 1,
        limit: 10,
        sort: "asc",
        searchText: "demo",
      },
      "report123",
      mockSession,
    );

    expect(result).toEqual(["ws1", "ws2"]);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${TEMP_BACKEND_URI}/timelog/worksheet/report123?page=1&limit=10&sort-order=asc&search=demo`,
      expect.any(Object),
    );
  });

  it("RemoveWorksheetData - should call delete with correct data and return response", async () => {
    const mockResponse = { data: { removed: true } };
    mockedAxios.delete.mockResolvedValueOnce(mockResponse);

    const data = { worksheetId: "abc123" };
    const result = await RemoveWorksheetData(data, mockSession);

    expect(result).toEqual({ removed: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith(
      `${TEMP_BACKEND_URI}/timelog/worksheet/remove-activities`,
      expect.objectContaining({
        data,
        headers: expect.objectContaining({
          Authorization: "Bearer mockAccessToken",
        }),
      }),
    );
  });
});
