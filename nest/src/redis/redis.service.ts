import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CACHE_TTL, RedisPrefixEnum } from '../data';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}
  private makeKey(prefix: RedisPrefixEnum, page: string): string {
    return `${prefix}:${page}`;
  }

  async getDataMultiple(keyFind: string): Promise<string | null> {
    const result = await this.redis.get(keyFind);

    if (!result) return null;

    return JSON.parse(result);
  }

  async saveItemsMultiple(
    key: string,
    data: any,
    ttl: number = CACHE_TTL.ONE_MINUTE,
  ): Promise<void> {
    const value = JSON.stringify(data);
    await this.redis.set(key, value, 'EX', ttl);
    await this.redis.expire(key, ttl);
  }

  async saveDataItem(key: string, data, ttl: number = CACHE_TTL.FIVE_MINUTE) {
    const result = await this.redis.set(key, data, 'EX', ttl);
    await this.redis.expire(key, ttl);
    if (result) {
      return result;
    }

    return null;
  }

  async deleteItemCache(prefix: RedisPrefixEnum, id: number): Promise<void> {
    const key = this.makeKey(prefix, String(id));
    await this.redis.del(key);
  }
    async flushAll(): Promise<void> {
    await this.redis.flushall();
  }
}
