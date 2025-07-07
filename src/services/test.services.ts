import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTestItem = async () => {
  return await prisma.testItem.create({
    data: {
      title: 'Test Title',
      value: '12345'
    }
  });
};

export const getTestItems = async () => {
  return await prisma.testItem.findMany();
};
