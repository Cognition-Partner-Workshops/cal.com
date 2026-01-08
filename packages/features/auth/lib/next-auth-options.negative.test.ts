/**
 * Negative and Edge Test Cases for Login/Authentication
 * These tests verify error handling and edge cases in the authentication flow
 */

import { IdentityProvider, UserPermissionRole } from "@calcom/prisma/enums";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorCode } from "./ErrorCode";

vi.mock("@calcom/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

const mockFindByEmailAndIncludeProfilesAndPassword: ReturnType<typeof vi.fn> = vi.fn();

vi.mock("@calcom/features/users/repositories/UserRepository", () => {
  return {
    UserRepository: vi.fn().mockImplementation(function () {
      return {
        findByEmailAndIncludeProfilesAndPassword: mockFindByEmailAndIncludeProfilesAndPassword,
      };
    }),
  };
});

vi.mock("./verifyPassword", () => ({
  verifyPassword: vi.fn(),
}));

const mockCheckRateLimitAndThrowError: ReturnType<typeof vi.fn> = vi.fn();
vi.mock("@calcom/lib/checkRateLimitAndThrowError", () => ({
  checkRateLimitAndThrowError: mockCheckRateLimitAndThrowError,
}));

vi.mock("@calcom/lib/server/PiiHasher", () => ({
  hashEmail: vi.fn((email: string) => `hashed_${email}`),
}));

const mockTotpAuthenticatorCheck: ReturnType<typeof vi.fn> = vi.fn();
vi.mock("@calcom/lib/totp", () => ({
  totpAuthenticatorCheck: mockTotpAuthenticatorCheck,
}));

vi.mock("@calcom/lib/crypto", () => ({
  symmetricDecrypt: vi.fn(),
  symmetricEncrypt: vi.fn(),
}));

vi.mock("@calcom/lib/auth/isPasswordValid", () => ({
  isPasswordValid: vi.fn(),
}));

vi.mock("@calcom/lib/env", () => ({
  isENVDev: false,
}));

vi.mock("@calcom/lib/constants", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@calcom/lib/constants")>();
  return {
    ...actual,
    IS_TEAM_BILLING_ENABLED: false,
    ENABLE_PROFILE_SWITCHER: false,
    WEBAPP_URL: "http://localhost:3000",
  };
});

vi.mock("@calcom/lib/logger", () => ({
  default: {
    getSubLogger: vi.fn(() => ({
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
    })),
  },
}));

vi.mock("@calcom/lib/safeStringify", () => ({
  safeStringify: vi.fn((obj) => JSON.stringify(obj)),
}));

vi.mock("./next-auth-custom-adapter", () => ({
  default: vi.fn(() => ({
    linkAccount: vi.fn(),
  })),
}));

vi.mock("@calcom/features/profile/repositories/ProfileRepository", () => ({
  ProfileRepository: {
    findAllProfilesForUserIncludingMovedUser: vi.fn(),
    findByUpIdWithAuth: vi.fn(),
  },
}));

describe("CredentialsProvider authorize - Negative and Edge Cases", () => {
  let authorizeCredentials: typeof import("./next-auth-options").authorizeCredentials;
  let verifyPassword: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockFindByEmailAndIncludeProfilesAndPassword.mockReset();
    mockCheckRateLimitAndThrowError.mockResolvedValue(undefined);

    const verifyPasswordModule = await import("./verifyPassword");
    verifyPassword = verifyPasswordModule.verifyPassword as ReturnType<typeof vi.fn>;

    const authModule = await import("./next-auth-options");
    authorizeCredentials = authModule.authorizeCredentials;
  });

  const createMockUser = (overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> => ({
    id: 1,
    email: "test@example.com",
    name: "Test User",
    username: "testuser",
    role: UserPermissionRole.USER,
    locked: false,
    identityProvider: IdentityProvider.CAL,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    backupCodes: null,
    password: {
      hash: "$2a$10$hashedpassword",
    },
    allProfiles: [
      {
        id: 1,
        upId: "usr_123",
        username: "testuser",
      },
    ],
    teams: [],
    ...overrides,
  });

  describe("User Not Found Scenarios", () => {
    it("should throw error when user does not exist in database", async () => {
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(null);

      await expect(
        authorizeCredentials({
          email: "nonexistent@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should throw error for empty email", async () => {
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(null);

      await expect(
        authorizeCredentials({
          email: "",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should throw error for whitespace-only email", async () => {
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(null);

      await expect(
        authorizeCredentials({
          email: "   ",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });
  });

  describe("Locked Account Scenarios", () => {
    it("should throw error when user account is locked", async () => {
      const mockUser = createMockUser({
        locked: true,
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.UserAccountLocked);
    });

    it("should throw locked error even with correct password", async () => {
      const mockUser = createMockUser({
        locked: true,
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);
      verifyPassword.mockResolvedValue(true);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "correctpassword",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.UserAccountLocked);
    });
  });

  describe("Password Validation Edge Cases", () => {
    it("should throw error when password is empty", async () => {
      const mockUser = createMockUser();
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);
      verifyPassword.mockResolvedValue(false);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should throw error when password verification fails", async () => {
      const mockUser = createMockUser();
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);
      verifyPassword.mockResolvedValue(false);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "wrongpassword",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should throw error for user with null password hash", async () => {
      const mockUser = createMockUser({
        password: null,
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });
  });

  describe("Two-Factor Authentication Edge Cases", () => {
    it("should throw error when 2FA is enabled but no code provided", async () => {
      const mockUser = createMockUser({
        twoFactorEnabled: true,
        twoFactorSecret: "encrypted_secret",
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);
      verifyPassword.mockResolvedValue(true);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.SecondFactorRequired);
    });

    it("should throw error when 2FA code is empty string (requires second factor)", async () => {
      const mockUser = createMockUser({
        twoFactorEnabled: true,
        twoFactorSecret: "encrypted_secret",
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);
      verifyPassword.mockResolvedValue(true);
      mockTotpAuthenticatorCheck.mockReturnValue(false);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
          totpCode: "",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.SecondFactorRequired);
    });
  });

  describe("Identity Provider Edge Cases", () => {
    it("should throw error for Google identity provider user without password", async () => {
      const mockUser = createMockUser({
        password: null,
        identityProvider: IdentityProvider.GOOGLE,
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should throw error for SAML identity provider user without password", async () => {
      const mockUser = createMockUser({
        password: null,
        identityProvider: IdentityProvider.SAML,
      });
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(mockUser);

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });
  });

  describe("Rate Limiting Edge Cases", () => {
    it("should handle rate limit check during authentication", async () => {
      // Rate limiting is checked but errors are caught and converted to IncorrectEmailPassword
      // to prevent user enumeration attacks
      mockCheckRateLimitAndThrowError.mockRejectedValue(new Error(ErrorCode.RateLimitExceeded));

      await expect(
        authorizeCredentials({
          email: "test@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });
  });

  describe("Email Format Edge Cases", () => {
    it("should handle email with special characters", async () => {
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(null);

      await expect(
        authorizeCredentials({
          email: "test+special@example.com",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should handle email with uppercase characters", async () => {
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(null);

      await expect(
        authorizeCredentials({
          email: "TEST@EXAMPLE.COM",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });

    it("should handle email with leading/trailing spaces", async () => {
      mockFindByEmailAndIncludeProfilesAndPassword.mockResolvedValue(null);

      await expect(
        authorizeCredentials({
          email: "  test@example.com  ",
          password: "password123",
        } as Parameters<typeof authorizeCredentials>[0])
      ).rejects.toThrow(ErrorCode.IncorrectEmailPassword);
    });
  });
});
