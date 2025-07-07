import { prisma } from "../lib/prisma";
import { CreateDiseaseData, PaginationParams, SearchParams } from "../types";

export class DiseaseService {
  async createDisease(data: CreateDiseaseData) {
    return await prisma.disease.create({
      data,
      include: {
        crops: {
          include: {
            crop: true,
          },
        },
        livestock: {
          include: {
            livestock: true,
          },
        },
        controlMeasures: {
          include: {
            controlMeasure: true,
          },
        },
      },
    });
  }

  async getDiseases(params: PaginationParams & SearchParams) {
    const { page = 1, limit = 10, query, type, severity } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { scientificName: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      }),
      ...(type && { type: type as any }),
      ...(severity && { severity: severity as any }),
    };

    const [diseases, total] = await Promise.all([
      prisma.disease.findMany({
        where,
        skip,
        take: limit,
        include: {
          crops: {
            include: {
              crop: true,
            },
          },
          livestock: {
            include: {
              livestock: true,
            },
          },
          controlMeasures: {
            include: {
              controlMeasure: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.disease.count({ where }),
    ]);

    return {
      diseases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDiseaseById(id: string) {
    return await prisma.disease.findUnique({
      where: { id },
      include: {
        crops: {
          include: {
            crop: true,
          },
        },
        livestock: {
          include: {
            livestock: true,
          },
        },
        controlMeasures: {
          include: {
            controlMeasure: true,
          },
        },
      },
    });
  }

  async updateDisease(id: string, data: Partial<CreateDiseaseData>) {
    return await prisma.disease.update({
      where: { id },
      data,
      include: {
        crops: {
          include: {
            crop: true,
          },
        },
        livestock: {
          include: {
            livestock: true,
          },
        },
        controlMeasures: {
          include: {
            controlMeasure: true,
          },
        },
      },
    });
  }

  async deleteDisease(id: string) {
    return await prisma.disease.delete({
      where: { id },
    });
  }

  async addControlMeasureToDisease(
    diseaseId: string,
    controlMeasureId: string,
  ) {
    return await prisma.diseaseControlMeasure.create({
      data: {
        diseaseId,
        controlMeasureId,
      },
      include: {
        disease: true,
        controlMeasure: true,
      },
    });
  }

  async removeControlMeasureFromDisease(
    diseaseId: string,
    controlMeasureId: string,
  ) {
    return await prisma.diseaseControlMeasure.delete({
      where: {
        diseaseId_controlMeasureId: {
          diseaseId,
          controlMeasureId,
        },
      },
    });
  }

  async getDiseaseTypes() {
    return await prisma.disease.findMany({
      select: {
        type: true,
      },
      distinct: ["type"],
    });
  }

  async getDiseasesByCrop(cropId: string) {
    return await prisma.disease.findMany({
      where: {
        crops: {
          some: {
            cropId,
          },
        },
      },
      include: {
        controlMeasures: {
          include: {
            controlMeasure: true,
          },
        },
      },
    });
  }

  async getDiseasesByLivestock(livestockId: string) {
    return await prisma.disease.findMany({
      where: {
        livestock: {
          some: {
            livestockId,
          },
        },
      },
      include: {
        controlMeasures: {
          include: {
            controlMeasure: true,
          },
        },
      },
    });
  }
}
