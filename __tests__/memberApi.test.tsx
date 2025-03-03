import axios from 'axios';
import {
  GetTeamList,
  GetIndividualOverview,
  GetDailyPerformance,
  GetIndividualTeamMember,
  GetGitData,
  GetGitCalculations,
  GetProjects,
  GetRoles,
  CreateInviteMember,
  ToggleMemberState,
} from '../helpers/Member/memberApi';
import { TEMP_BACKEND_URI } from '../globalConstants';
import { InviteMemberForm } from '@/types/Members.types';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('memberApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockSession = {
    data: {
      accessToken: 'mockAccessToken',
      expires: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour in the future
    },
  };

  describe('GetTeamList', () => {
    it('should fetch team list successfully', async () => {
      const mockResponse = { data: { count: 10, data: [] } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetTeamList({ page: 1, limit: 10 }, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/users/overview?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching team list', async () => {
      const mockError = new Error('Failed to fetch team list');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetTeamList({ page: 1, limit: 10 }, mockSession)).rejects.toThrow('Failed to fetch team list');
    });
  });

  describe('GetIndividualOverview', () => {
    it('should fetch individual overview successfully', async () => {
      const mockResponse = { data: {} };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetIndividualOverview({ member_id: '1', page: 1, limit: 10 }, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/users/individual?userId=1&page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching individual overview', async () => {
      const mockError = new Error('Failed to fetch individual overview');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetIndividualOverview({ member_id: '1', page: 1, limit: 10 }, mockSession)).rejects.toThrow('Failed to fetch individual overview');
    });
  });

  describe('GetDailyPerformance', () => {
    it('should fetch daily performance successfully', async () => {
      const mockResponse = { data: {} };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);
  
      const result = await GetDailyPerformance({ member_id: '1', date: '2025-02-15', page: 1, limit: 10 }, mockSession);
  
      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/users/daily-performance?userId=1&dateTime=2025-02-15&Page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });
  
    it('should handle error while fetching daily performance', async () => {
      const mockError = new Error('Failed to fetch daily performance');
      mockedAxios.get.mockRejectedValueOnce(mockError);
  
      await expect(GetDailyPerformance({ member_id: '1', date: '2025-02-15', page: 1, limit: 10 }, mockSession)).rejects.toThrow('Failed to fetch daily performance');
    });
  });

  describe('GetIndividualTeamMember', () => {
    it('should fetch individual team member successfully', async () => {
      const mockResponse = { data: {} };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetIndividualTeamMember('1', mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/users/user-info?userId=1`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching individual team member', async () => {
      const mockError = new Error('Failed to fetch individual team member');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetIndividualTeamMember('1', mockSession)).rejects.toThrow('Failed to fetch individual team member');
    });
  });

  describe('GetGitData', () => {
    it('should fetch Git data successfully', async () => {
      const mockResponse = { data: {} };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetGitData({ member_id: '1', date: '2025-02-15' }, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/github/get-contributions?userId=1&date=2025-02-15`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching Git data', async () => {
      const mockError = new Error('Failed to fetch Git data');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetGitData({ member_id: '1', date: '2025-02-15' }, mockSession)).rejects.toThrow('Failed to fetch Git data');
    });
  });

  describe('GetGitCalculations', () => {
    it('should fetch Git calculations successfully', async () => {
      const mockResponse = { data: {} };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetGitCalculations({ member_id: '1', date: '2025-02-15' }, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/github/summary?userId=1&date=2025-02-15`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching Git calculations', async () => {
      const mockError = new Error('Failed to fetch Git calculations');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetGitCalculations({ member_id: '1', date: '2025-02-15' }, mockSession)).rejects.toThrow('Failed to fetch Git calculations');
    });
  });

  describe('GetProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetProjects(mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/projects/names?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching projects', async () => {
      const mockError = new Error('Failed to fetch projects');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetProjects(mockSession)).rejects.toThrow('Failed to fetch projects');
    });
  });

  describe('GetRoles', () => {
    it('should fetch roles successfully', async () => {
      const mockResponse = { data: [] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await GetRoles(mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/organization/roles`,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while fetching roles', async () => {
      const mockError = new Error('Failed to fetch roles');
      mockedAxios.get.mockRejectedValueOnce(mockError);

      await expect(GetRoles(mockSession)).rejects.toThrow('Failed to fetch roles');
    });
  });

  describe('CreateInviteMember', () => {
    it('should create invite member successfully', async () => {
      const mockData: InviteMemberForm = {
        displayName: 'John Doe',
        emailAddress: 'john.doe@example.com',
        designation: 'Software Engineer',
        projects: ['Project 1'],
        jiraId: 'jira123',
        trelloId: 'trello123',
        githubUserName: 'github123',
        role: 'Member',
        profilePicture: null,
      };
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await CreateInviteMember(mockData, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/users/invite`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while creating invite member', async () => {
      const mockData: InviteMemberForm = {
        displayName: 'John Doe',
        emailAddress: 'john.doe@example.com',
        designation: 'Software Engineer',
        projects: ['Project 1'],
        jiraId: 'jira123',
        trelloId: 'trello123',
        githubUserName: 'github123',
        role: 'Member',
        profilePicture: null,
      };
      const mockError = new Error('Failed to create invite member');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(CreateInviteMember(mockData, mockSession)).rejects.toThrow('Failed to create invite member');
    });
  });

  describe('ToggleMemberState', () => {
    it('should toggle member state successfully', async () => {
      const mockData = 'memberId';
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await ToggleMemberState(mockData, mockSession);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/users/toggle-enable`,
        mockData,
        {
          headers: {
            Authorization: `Bearer mockAccessToken`,
          },
        }
      );
    });

    it('should handle error while toggling member state', async () => {
      const mockData = 'memberId';
      const mockError = new Error('Failed to toggle member state');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(ToggleMemberState(mockData, mockSession)).rejects.toThrow('Failed to toggle member state');
    });
  });
});