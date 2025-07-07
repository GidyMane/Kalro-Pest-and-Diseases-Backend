import { prisma } from "../lib/prisma";
import { CreateFAQData, PaginationParams, SearchParams } from "../types";

export class FAQService {
  async createFAQ(data: CreateFAQData) {
    return await prisma.fAQ.create({
      data,
    });
  }

  async getFAQs(params: PaginationParams & SearchParams) {
    const { page = 1, limit = 10, query, category } = params;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(query && {
        OR: [
          { question: { contains: query, mode: "insensitive" as const } },
          { answer: { contains: query, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category }),
    };

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      }),
      prisma.fAQ.count({ where }),
    ]);

    return {
      faqs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFAQById(id: string) {
    return await prisma.fAQ.findUnique({
      where: { id, isActive: true },
    });
  }

  async updateFAQ(id: string, data: Partial<CreateFAQData>) {
    return await prisma.fAQ.update({
      where: { id },
      data,
    });
  }

  async deleteFAQ(id: string) {
    return await prisma.fAQ.delete({
      where: { id },
    });
  }

  async getFAQCategories() {
    return await prisma.fAQ.findMany({
      where: { isActive: true, category: { not: null } },
      select: {
        category: true,
      },
      distinct: ["category"],
    });
  }

  async searchFAQs(query: string) {
    return await prisma.fAQ.findMany({
      where: {
        isActive: true,
        OR: [
          { question: { contains: query, mode: "insensitive" } },
          { answer: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  }
}
