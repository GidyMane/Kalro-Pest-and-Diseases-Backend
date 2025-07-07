import { prisma } from "../lib/prisma";
import { CreateDocumentData, PaginationParams, SearchParams } from "../types";

export class DocumentService {
  async createDocument(data: CreateDocumentData) {
    return await prisma.document.create({
      data,
    });
  }

  async getDocuments(params: PaginationParams & SearchParams) {
    const { page = 1, limit = 10, query, type } = params;
    const skip = (page - 1) * limit;

    const where = {
      isPublic: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
          { author: { contains: query, mode: "insensitive" as const } },
          { keywords: { has: query } },
        ],
      }),
      ...(type && { type: type as any }),
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.document.count({ where }),
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDocumentById(id: string) {
    return await prisma.document.findUnique({
      where: { id, isPublic: true },
    });
  }

  async updateDocument(id: string, data: Partial<CreateDocumentData>) {
    return await prisma.document.update({
      where: { id },
      data,
    });
  }

  async deleteDocument(id: string) {
    return await prisma.document.delete({
      where: { id },
    });
  }

  async getDocumentTypes() {
    return await prisma.document.findMany({
      select: {
        type: true,
      },
      distinct: ["type"],
    });
  }

  async searchDocuments(query: string, tags?: string[]) {
    const where = {
      isPublic: true,
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
        { keywords: { hasSome: [query] } },
      ],
      ...(tags &&
        tags.length > 0 && {
          tags: { hasSome: tags },
        }),
    };

    return await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  async getRecentDocuments(limit: number = 5) {
    return await prisma.document.findMany({
      where: { isPublic: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  }
}
