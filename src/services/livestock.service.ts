import { prisma } from "../lib/prisma";
import { CreateLivestockData, PaginationParams, SearchParams } from "../types";

export class LivestockService {
  async createLivestock(data: CreateLivestockData) {
    return await prisma.livestock.create({
      data,
      include: {
        pests: {
          include: {
            pest: true,
          },
        },
        diseases: {
          include: {
            disease: true,
          },
        },
      },
    });
  }

  async getLivestock(params: PaginationParams & SearchParams) {
    const { page = 1, limit = 10, query, category } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { scientificName: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      }),
      ...(category && { category: category as any }),
    };

    const [livestock, total] = await Promise.all([
      prisma.livestock.findMany({
        where,
        skip,
        take: limit,
        include: {
          pests: {
            include: {
              pest: true,
            },
          },
          diseases: {
            include: {
              disease: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.livestock.count({ where }),
    ]);

    return {
      livestock,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLivestockById(id: string) {
    return await prisma.livestock.findUnique({
      where: { id },
      include: {
        pests: {
          include: {
            pest: {
              include: {
                controlMeasures: {
                  include: {
                    controlMeasure: true,
                  },
                },
              },
            },
          },
        },
        diseases: {
          include: {
            disease: {
              include: {
                controlMeasures: {
                  include: {
                    controlMeasure: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateLivestock(id: string, data: Partial<CreateLivestockData>) {
    return await prisma.livestock.update({
      where: { id },
      data,
      include: {
        pests: {
          include: {
            pest: true,
          },
        },
        diseases: {
          include: {
            disease: true,
          },
        },
      },
    });
  }

  async deleteLivestock(id: string) {
    return await prisma.livestock.delete({
      where: { id },
    });
  }

  async addPestToLivestock(livestockId: string, pestId: string) {
    return await prisma.livestockPest.create({
      data: {
        livestockId,
        pestId,
      },
      include: {
        livestock: true,
        pest: true,
      },
    });
  }

  async removePestFromLivestock(livestockId: string, pestId: string) {
    return await prisma.livestockPest.delete({
      where: {
        livestockId_pestId: {
          livestockId,
          pestId,
        },
      },
    });
  }

  async addDiseaseToLivestock(livestockId: string, diseaseId: string) {
    return await prisma.livestockDisease.create({
      data: {
        livestockId,
        diseaseId,
      },
      include: {
        livestock: true,
        disease: true,
      },
    });
  }

  async removeDiseaseFromLivestock(livestockId: string, diseaseId: string) {
    return await prisma.livestockDisease.delete({
      where: {
        livestockId_diseaseId: {
          livestockId,
          diseaseId,
        },
      },
    });
  }

  async getLivestockCategories() {
    return await prisma.livestock.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });
  }
}
