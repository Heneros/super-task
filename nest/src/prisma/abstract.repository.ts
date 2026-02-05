import { PrismaClient } from '@prisma/client';

export abstract class AbstractRepositoryPrisma<T> {
  protected abstract readonly prisma: PrismaClient;

  protected abstract readonly model: any;
  async findFirst(where: any): Promise<T | null> {
    return this.model.findFirst({ where });
  }

  async findUnique(where: any): Promise<T | null> {
    return this.model.findUnique({ where });
  }

  async findMany(params?: {
    where?: any;
    skip?: number;
    include?: any;
    take?: number;
    orderBy?: any;
  }): Promise<T[]> {
    return this.model.findMany(params);
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async createMany(data: any): Promise<T> {
    return this.model.createMany({ data });
  }

  async update(where: any, data: any): Promise<T> {
    return this.model.update({ where, data });
  }

  async delete(where: any): Promise<T> {
    return this.model.delete({ where });
  }

  // async $transaction(async (tx)){

  // }
}
