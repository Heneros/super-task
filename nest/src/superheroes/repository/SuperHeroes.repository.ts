import { Injectable } from '@nestjs/common';
import {  PrismaClient, SuperHero } from '@prisma/client';
import { AbstractRepositoryPrisma } from '@/prisma/abstract.repository';
import { PrismaService } from '@/prisma/prisma.service';
import { PAGINATION_LIMIT } from '@/data/defaultVariables';

@Injectable()
export class SuperHeroesRepository extends AbstractRepositoryPrisma<SuperHero> {
  protected readonly prisma: PrismaClient;
  protected readonly model: any;

  public readonly superModel;

  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = this.prisma.superHero;
    this.superModel = this.prismaService.superHero;
  }

  }

