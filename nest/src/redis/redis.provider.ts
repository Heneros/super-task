import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const env = configService.get('NODE_ENV');

    if (env === 'production') {
      const redisUrl = configService.get<string>('REDIS_URL_ORIGINAL');

      if (!redisUrl) {
        throw new Error('REDIS_URL_ORIGINAL is not defined in .env');
      }

      return new Redis(redisUrl);
    }

    // const host = process.env.REDIS_HOST;
    const host = configService.get<string>('REDIS_HOST');
    const port = configService.get<number>('REDIS_PORT', 6379);

    return new Redis({
      host,
      port,

      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  },
  inject: [ConfigService],
};
