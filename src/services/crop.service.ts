import { prisma } from "../lib/prisma";
import { CreateCropData, PaginationParams, SearchParams } from "../types";

export class CropService {
  async createCrop(data: CreateCropData) {
    return await prisma.crop.create({
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

  async getCrops(params: PaginationParams & SearchParams) {
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

    const [crops, total] = await Promise.all([
      prisma.crop.findMany({
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
      prisma.crop.count({ where }),
    ]);

    return {
      crops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCropById(id: string) {
    return await prisma.crop.findUnique({
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

  async updateCrop(id: string, data: Partial<CreateCropData>) {
    return await prisma.crop.update({
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

  async deleteCrop(id: string) {
    return await prisma.crop.delete({
      where: { id },
    });
  }

  async addPestToCrop(cropId: string, pestId: string) {
    return await prisma.cropPest.create({
      data: {
        cropId,
        pestId,
      },
      include: {
        crop: true,
        pest: true,
      },
    });
  }

  async removePestFromCrop(cropId: string, pestId: string) {
    return await prisma.cropPest.delete({
      where: {
        cropId_pestId: {
          cropId,
          pestId,
        },
      },
    });
  }

  async addDiseaseToCrop(cropId: string, diseaseId: string) {
    return await prisma.cropDisease.create({
      data: {
        cropId,
        diseaseId,
      },
      include: {
        crop: true,
        disease: true,
      },
    });
  }

  async removeDiseaseFromCrop(cropId: string, diseaseId: string) {
    return await prisma.cropDisease.delete({
      where: {
        cropId_diseaseId: {
          cropId,
          diseaseId,
        },
      },
    });
  }

  async getCropCategories() {
    return await prisma.crop.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
    });
  }
}
