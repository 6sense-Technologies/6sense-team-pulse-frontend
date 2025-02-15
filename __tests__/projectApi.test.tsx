import axios from 'axios';
import {
  GetProjectList,
  GetTools,
  CreateProject,
  GetDesignations,
} from '../helpers/projects/projectApi';
import { TEMP_BACKEND_URI } from '../globalConstants';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('projectApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSession = {
    data: {
      accessToken: 'mockAccessToken',
      expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour in the future
    },
  };

  describe('GetProjectList', () => {
    it('should fetch project list successfully', async () => {
      const mockResponse = { data: { count: 10, data: [] } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetProjectList({ page: 1, limit: 10 }, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/projects?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching project list', async () => {
      const mockError = new Error('Failed to fetch project list');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetProjectList({ page: 1, limit: 10 }, mockSession)).rejects.toThrow('Failed to fetch project list');
    });
  });

  describe('GetTools', () => {
    it('should fetch tools successfully', async () => {
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetTools();

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${TEMP_BACKEND_URI}/tool/list`);
    });

    it('should handle error while fetching tools', async () => {
      const mockError = new Error('Failed to fetch tools');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetTools()).rejects.toThrow('Failed to fetch tools');
    });
  });

  describe('CreateProject', () => {
    it('should create project successfully', async () => {
      const mockData = { name: 'New Project' };
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await CreateProject(mockData, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/projects`,
        mockData,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while creating project', async () => {
      const mockData = { name: 'New Project' };
      const mockError = new Error('Failed to create project');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(CreateProject(mockData, mockSession)).rejects.toThrow('Failed to create project');
    });
  });

  describe('GetDesignations', () => {
    it('should fetch designations successfully', async () => {
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetDesignations();

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${TEMP_BACKEND_URI}/users/designations/list`);
    });

    it('should handle error while fetching designations', async () => {
      const mockError = new Error('Failed to fetch designations');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetDesignations()).rejects.toThrow('Failed to fetch designations');
    });
  });
});