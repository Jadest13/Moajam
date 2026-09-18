import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}
  bucket(): ReturnType<SupabaseClient['storage']['from']> {
    const secret = this.config.get<string>('SUPABASE_SECRET_KEY');
    if (!secret) throw new ServiceUnavailableException('파일 저장소가 연결되지 않았습니다.');
    return createClient(this.config.getOrThrow<string>('SUPABASE_URL'), secret, {
      auth: { persistSession: false, autoRefreshToken: false },
    }).storage.from(this.config.get<string>('MEDIA_BUCKET') ?? 'moajam-private');
  }
  async signed(key: string) {
    const { data, error } = await this.bucket().createSignedUrl(key, 300);
    if (error || !data) throw new ServiceUnavailableException('파일 링크를 만들지 못했습니다.');
    return data.signedUrl;
  }
}
