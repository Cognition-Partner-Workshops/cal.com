import { compare } from "bcryptjs";
import { defaultResponderForAppDir } from "app/api/defaultResponderForAppDir";
import { parseRequestData } from "app/api/parseRequestData";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { validPassword } from "@calcom/features/auth/lib/validPassword";
import { hashPassword } from "@calcom/lib/auth/hashPassword";
import { checkRateLimitAndThrowError } from "@calcom/lib/checkRateLimitAndThrowError";
import getIP from "@calcom/lib/getIP";
import { piiHasher } from "@calcom/lib/server/PiiHasher";
import prisma from "@calcom/prisma";
import { IdentityProvider } from "@calcom/prisma/enums";

const PASSWORD_HISTORY_LIMIT = 2;

const passwordResetRequestSchema = z.object({
  csrfToken: z.string(),
  password: z.string().refine(validPassword, () => ({
    message: "Password does not meet the requirements",
  })),
  requestId: z.string(), // format doesn't matter.
});

async function checkPasswordHistory(
  rawPassword: string,
  currentPasswordHash: string | null,
  passwordHistory: Array<{ hash: string }>
): Promise<boolean> {
  const passwordsToCheck: string[] = [];
  if (currentPasswordHash) {
    passwordsToCheck.push(currentPasswordHash);
  }
  passwordsToCheck.push(...passwordHistory.map((ph) => ph.hash));

  for (const oldHash of passwordsToCheck) {
    const isMatch = await compare(rawPassword, oldHash);
    if (isMatch) {
      return true;
    }
  }
  return false;
}

async function updatePasswordHistory(userId: number, currentPasswordHash: string): Promise<void> {
  await prisma.passwordHistory.create({
    data: {
      hash: currentPasswordHash,
      userId: userId,
    },
  });

  const oldEntries = await prisma.passwordHistory.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    skip: PASSWORD_HISTORY_LIMIT,
    select: { id: true },
  });

  if (oldEntries.length > 0) {
    await prisma.passwordHistory.deleteMany({
      where: { id: { in: oldEntries.map((e) => e.id) } },
    });
  }
}

async function handler(req: NextRequest) {
  const body = await parseRequestData(req);
  const {
    password: rawPassword,
    requestId: rawRequestId,
    csrfToken: submittedToken,
  } = passwordResetRequestSchema.parse(body);
  const cookieStore = await cookies();

  const cookieToken = cookieStore.get("calcom.csrf_token")?.value;

  if (submittedToken !== cookieToken) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  cookieStore.delete("calcom.csrf_token");

  const remoteIp = getIP(req);
  await checkRateLimitAndThrowError({
    rateLimitingType: "core",
    identifier: `api:reset-password:${piiHasher.hash(remoteIp)}`,
  });

  const maybeRequest = await prisma.resetPasswordRequest.findFirstOrThrow({
    where: {
      id: rawRequestId,
      expires: { gt: new Date() },
    },
    select: { email: true },
  });

  const user = await prisma.user.findUnique({
    where: { email: maybeRequest.email },
    select: {
      id: true,
      password: { select: { hash: true } },
      passwordHistory: {
        orderBy: { createdAt: "desc" },
        take: PASSWORD_HISTORY_LIMIT,
        select: { hash: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  const isPasswordReused = await checkPasswordHistory(
    rawPassword,
    user.password?.hash ?? null,
    user.passwordHistory
  );

  if (isPasswordReused) {
    return NextResponse.json(
      { error: "Cannot reuse your last 2 passwords. Please choose a different password." },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(rawPassword);

  try {
    if (user.password) {
      await updatePasswordHistory(user.id, user.password.hash);
    }

    await prisma.user.update({
      where: { email: maybeRequest.email },
      data: {
        password: {
          upsert: {
            create: { hash: hashedPassword },
            update: { hash: hashedPassword },
          },
        },
        emailVerified: new Date(),
        identityProvider: IdentityProvider.CAL,
        identityProviderId: null,
      },
    });
  } catch (_e) {
    return NextResponse.json({}, { status: 404 });
  }

  await expireResetPasswordRequest(rawRequestId);

  return NextResponse.json({ message: "Password reset." }, { status: 201 });
}

async function expireResetPasswordRequest(rawRequestId: string) {
  await prisma.resetPasswordRequest.update({
    where: {
      id: rawRequestId,
    },
    data: {
      // We set the expiry to now to invalidate the request
      expires: new Date(),
    },
  });
}

export const POST = defaultResponderForAppDir(handler);
