import { prisma } from "../lib/prisma";
import {
  CreateControlMeasureData,
  PaginationParams,
  SearchParams,
} from "../types";

export class ControlMeasureService {
  async createControlMeasure(data: CreateControlMeasureData) {
    return await prisma.controlMeasure.create({
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

  async getControlMeasures(params: PaginationParams & SearchParams) {
    const { page = 1, limit = 10, query, type } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      }),
      ...(type && { method: type as any }),
    };

    const [controlMeasures, total] = await Promise.all([
      prisma.controlMeasure.findMany({
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
      prisma.controlMeasure.count({ where }),
    ]);

    return {
      controlMeasures,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getControlMeasureById(id: string) {
    return await prisma.controlMeasure.findUnique({
      where: { id },
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

  async updateControlMeasure(
    id: string,
    data: Partial<CreateControlMeasureData>,
  ) {
    return await prisma.controlMeasure.update({
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

  async deleteControlMeasure(id: string) {
    return await prisma.controlMeasure.delete({
      where: { id },
    });
  }

  async getControlMethods() {
    return await prisma.controlMeasure.findMany({
      select: {
        method: true,
      },
      distinct: ["method"],
    });
  }

  async getControlMeasuresByPest(pestId: string) {
    return await prisma.controlMeasure.findMany({
      where: {
        pests: {
          some: {
            pestId,
          },
        },
      },
    });
  }

  async getControlMeasuresByDisease(diseaseId: string) {
    return await prisma.controlMeasure.findMany({
      where: {
        diseases: {
          some: {
            diseaseId,
          },
        },
      },
    });
  }
}
