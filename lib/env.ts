

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// FIX: Define Buffer from globalThis to make it available in Node.js runtime without @types/node.
const Buffer = (globalThis as any).Buffer;

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    META_APP_ID: z.string().min(1),
    META_APP_SECRET: z.string().min(1),
    TOKEN_ENC_KEY: z.string().min(1).refine(
      (s) => Buffer.from(s, 'base64').length === 32,
      { message: "TOKEN_ENC_KEY must be a 32-byte base64 encoded string." }
    ),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    META_APP_ID: process.env.META_APP_ID,
    META_APP_SECRET: process.env.META_APP_SECRET,
    TOKEN_ENC_KEY: process.env.TOKEN_ENC_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
});