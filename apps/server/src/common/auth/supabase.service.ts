import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(config: ConfigService) {
    this.client = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_PUBLISHABLE_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async verifyAccessToken(accessToken: string): Promise<AuthenticatedUser> {
    const { data, error } = await this.client.auth.getClaims(accessToken);
    const claims = data?.claims;
    const subject = claims?.sub;

    if (error || !claims || typeof subject !== 'string') {
      throw new UnauthorizedException('유효하지 않거나 만료된 Access Token입니다.');
    }

    const email = claims.email;
    const role = claims.role;

    return {
      id: subject,
      ...(typeof email === 'string' ? { email } : {}),
      ...(typeof role === 'string' ? { role } : {}),
    };
  }
}
