import { prisma } from "../lib/prisma";
import { CreatePestData, PaginationParams, SearchParams } from "../types";

export class PestService {
  async createPest(data: CreatePestData) {
    return await prisma.pest.create({
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

  async getPests(params: PaginationParams & SearchParams) {
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

    const [pests, total] = await Promise.all([
      prisma.pest.findMany({
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
      prisma.pest.count({ where }),
    ]);

    return {
      pests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPestById(id: string) {
    return await prisma.pest.findUnique({
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

  async updatePest(id: string, data: Partial<CreatePestData>) {
    return await prisma.pest.update({
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

  async deletePest(id: string) {
    return await prisma.pest.delete({
      where: { id },
    });
  }

  async addControlMeasureToPest(pestId: string, controlMeasureId: string) {
    return await prisma.pestControlMeasure.create({
      data: {
        pestId,
        controlMeasureId,
      },
      include: {
        pest: true,
        controlMeasure: true,
      },
    });
  }

  async removeControlMeasureFromPest(pestId: string, controlMeasureId: string) {
    return await prisma.pestControlMeasure.delete({
      where: {
        pestId_controlMeasureId: {
          pestId,
          controlMeasureId,
        },
      },
    });
  }

  async getPestTypes() {
    return await prisma.pest.findMany({
      select: {
        type: true,
      },
      distinct: ["type"],
    });
  }

  async getPestsByCrop(cropId: string) {
    return await prisma.pest.findMany({
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

  async getPestsByLivestock(livestockId: string) {
    return await prisma.pest.findMany({
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
