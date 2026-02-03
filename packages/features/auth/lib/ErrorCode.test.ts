import { describe, it, expect } from "vitest";

import { ErrorCode } from "./ErrorCode";

describe("ErrorCode", () => {
  describe("enum values", () => {
    it("has IncorrectEmailPassword error code", () => {
      expect(ErrorCode.IncorrectEmailPassword).toBe("incorrect-email-password");
    });

    it("has UserNotFound error code", () => {
      expect(ErrorCode.UserNotFound).toBe("user-not-found");
    });

    it("has IncorrectPassword error code", () => {
      expect(ErrorCode.IncorrectPassword).toBe("incorrect-password");
    });

    it("has UserMissingPassword error code", () => {
      expect(ErrorCode.UserMissingPassword).toBe("missing-password");
    });

    it("has TwoFactorDisabled error code", () => {
      expect(ErrorCode.TwoFactorDisabled).toBe("two-factor-disabled");
    });

    it("has TwoFactorAlreadyEnabled error code", () => {
      expect(ErrorCode.TwoFactorAlreadyEnabled).toBe("two-factor-already-enabled");
    });

    it("has TwoFactorSetupRequired error code", () => {
      expect(ErrorCode.TwoFactorSetupRequired).toBe("two-factor-setup-required");
    });

    it("has SecondFactorRequired error code", () => {
      expect(ErrorCode.SecondFactorRequired).toBe("second-factor-required");
    });

    it("has IncorrectTwoFactorCode error code", () => {
      expect(ErrorCode.IncorrectTwoFactorCode).toBe("incorrect-two-factor-code");
    });

    it("has IncorrectBackupCode error code", () => {
      expect(ErrorCode.IncorrectBackupCode).toBe("incorrect-backup-code");
    });

    it("has MissingBackupCodes error code", () => {
      expect(ErrorCode.MissingBackupCodes).toBe("missing-backup-codes");
    });

    it("has IncorrectEmailVerificationCode error code", () => {
      expect(ErrorCode.IncorrectEmailVerificationCode).toBe("incorrect_email_verification_code");
    });

    it("has InternalServerError error code", () => {
      expect(ErrorCode.InternalServerError).toBe("internal-server-error");
    });

    it("has NewPasswordMatchesOld error code", () => {
      expect(ErrorCode.NewPasswordMatchesOld).toBe("new-password-matches-old");
    });

    it("has ThirdPartyIdentityProviderEnabled error code", () => {
      expect(ErrorCode.ThirdPartyIdentityProviderEnabled).toBe("third-party-identity-provider-enabled");
    });

    it("has RateLimitExceeded error code", () => {
      expect(ErrorCode.RateLimitExceeded).toBe("rate-limit-exceeded");
    });

    it("has SocialIdentityProviderRequired error code", () => {
      expect(ErrorCode.SocialIdentityProviderRequired).toBe("social-identity-provider-required");
    });

    it("has UserAccountLocked error code", () => {
      expect(ErrorCode.UserAccountLocked).toBe("user-account-locked");
    });
  });

  describe("enum completeness", () => {
    it("contains all expected error codes", () => {
      const expectedCodes = [
        "IncorrectEmailPassword",
        "UserNotFound",
        "IncorrectPassword",
        "UserMissingPassword",
        "TwoFactorDisabled",
        "TwoFactorAlreadyEnabled",
        "TwoFactorSetupRequired",
        "SecondFactorRequired",
        "IncorrectTwoFactorCode",
        "IncorrectBackupCode",
        "MissingBackupCodes",
        "IncorrectEmailVerificationCode",
        "InternalServerError",
        "NewPasswordMatchesOld",
        "ThirdPartyIdentityProviderEnabled",
        "RateLimitExceeded",
        "SocialIdentityProviderRequired",
        "UserAccountLocked",
      ];

      const actualCodes = Object.keys(ErrorCode);
      expect(actualCodes).toEqual(expect.arrayContaining(expectedCodes));
      expect(actualCodes.length).toBe(expectedCodes.length);
    });
  });
});
