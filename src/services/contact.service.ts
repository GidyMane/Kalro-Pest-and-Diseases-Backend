import { prisma } from "../lib/prisma";
import { CreateContactSubmissionData, PaginationParams } from "../types";

export class ContactService {
  async createContactSubmission(data: CreateContactSubmissionData) {
    return await prisma.contactSubmission.create({
      data,
    });
  }

  async getContactSubmissions(params: PaginationParams & { isRead?: boolean }) {
    const { page = 1, limit = 10, isRead } = params;
    const skip = (page - 1) * limit;

    const where = {
      ...(typeof isRead === "boolean" && { isRead }),
    };

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return {
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getContactSubmissionById(id: string) {
    return await prisma.contactSubmission.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    return await prisma.contactSubmission.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async addResponse(id: string, response: string) {
    return await prisma.contactSubmission.update({
      where: { id },
      data: { response, isRead: true },
    });
  }

  async deleteContactSubmission(id: string) {
    return await prisma.contactSubmission.delete({
      where: { id },
    });
  }

  async getUnreadCount() {
    return await prisma.contactSubmission.count({
      where: { isRead: false },
    });
  }
}
