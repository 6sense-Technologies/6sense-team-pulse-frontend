import axios from 'axios';
import {
  handleBasicSignup,
  handleOtp,
  handleOrganizationDetails,
  handleResendOTP,
} from '../helpers/Auth/authApi';
import {
  TBasicSignupFormInputs,
  TOrgazinationDetails,
  TVerifyEmail,
} from '../src/types/Auth.types';

jest.mock('axios');

const TEMP_BACKEND_URI = "https://o4t-backend-for-tester.vercel.app"; // or your actual backend URI
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleBasicSignup', () => {
    it('should handle successful signup', async () => {
      const mockData: TBasicSignupFormInputs = {
        displayName: 'Test User',
        emailAddress: 'test@example.com',
        password: 'password123',
      };
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await handleBasicSignup(mockData);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/auth/register`,
        mockData,
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should handle signup error', async () => {
      const mockData: TBasicSignupFormInputs = {
        displayName: 'Test User',
        emailAddress: 'test@example.com',
        password: 'password123',
      };
      const mockError = new Error('Signup failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(handleBasicSignup(mockData)).rejects.toThrow('Signup failed');
    });
  });

  describe('handleOtp', () => {
    it('should handle successful OTP verification', async () => {
      const mockData: TVerifyEmail = { email: 'test@example.com', token: '123456' };
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await handleOtp(mockData);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/auth/register/verify-email`,
        mockData,
        { headers: { 'Content-Type': 'application/json' } }
      );
    });

    it('should handle OTP verification error', async () => {
      const mockData: TVerifyEmail = { email: 'test@example.com', token: '123456' };
      const mockError = new Error('OTP verification failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(handleOtp(mockData)).rejects.toThrow('OTP verification failed');
    });
  });

  describe('handleOrganizationDetails', () => {
    it('should handle successful organization details submission', async () => {
      const mockData: TOrgazinationDetails = { organizationName: 'Test Org', domainName: 'test.org' };
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      localStorage.setItem('accessToken', 'mockAccessToken');

      const result = await handleOrganizationDetails(mockData);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/auth/register/organization`,
        mockData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mockAccessToken',
          },
        }
      );
    });

    it('should handle organization details submission error', async () => {
      const mockData: TOrgazinationDetails = { organizationName: 'Test Org' };
      const mockError = new Error('Organization details submission failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);
      localStorage.setItem('accessToken', 'mockAccessToken');

      await expect(handleOrganizationDetails(mockData)).rejects.toThrow('Organization details submission failed');
    });
  });

  describe('handleResendOTP', () => {
    it('should handle successful OTP resend', async () => {
      const mockEmail = 'test@example.com';
      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await handleResendOTP(mockEmail);

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${TEMP_BACKEND_URI}/email-service/send-verfication-email?emailAddress=${mockEmail}`
      );
    });

    it('should handle OTP resend error', async () => {
      const mockEmail = 'test@example.com';
      const mockError = new Error('OTP resend failed');
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(handleResendOTP(mockEmail)).rejects.toThrow('OTP resend failed');
    });
  });
});