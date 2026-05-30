import { z } from 'zod';

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type TokensDto = z.infer<typeof TokensSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}