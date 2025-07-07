import { Request, Response } from "express";
import { PestService } from "../services/pest.service";
import { ApiResponse } from "../types";

const pestService = new PestService();

export class PestController {
  async createPest(req: Request, res: Response) {
    try {
      const pest = await pestService.createPest(req.body);
      const response: ApiResponse<typeof pest> = {
        success: true,
        data: pest,
        message: "Pest created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create pest",
      };
      res.status(400).json(response);
    }
  }

  async getPests(req: Request, res: Response) {
    try {
      const { page, limit, query, type, severity } = req.query;
      const result = await pestService.getPests({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        query: query as string,
        type: type as string,
        severity: severity as string,
      });

      const response: ApiResponse<typeof result.pests> = {
        success: true,
        data: result.pests,
        pagination: result.pagination,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch pests",
      };
      res.status(500).json(response);
    }
  }

  async getPestById(req: Request, res: Response) {
    try {
      const pest = await pestService.getPestById(req.params.id);
      if (!pest) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Pest not found",
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<typeof pest> = {
        success: true,
        data: pest,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch pest",
      };
      res.status(500).json(response);
    }
  }

  async updatePest(req: Request, res: Response) {
    try {
      const pest = await pestService.updatePest(req.params.id, req.body);
      const response: ApiResponse<typeof pest> = {
        success: true,
        data: pest,
        message: "Pest updated successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update pest",
      };
      res.status(400).json(response);
    }
  }

  async deletePest(req: Request, res: Response) {
    try {
      await pestService.deletePest(req.params.id);
      const response: ApiResponse<null> = {
        success: true,
        message: "Pest deleted successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete pest",
      };
      res.status(400).json(response);
    }
  }

  async getPestsByCrop(req: Request, res: Response) {
    try {
      const pests = await pestService.getPestsByCrop(req.params.cropId);
      const response: ApiResponse<typeof pests> = {
        success: true,
        data: pests,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pests for crop",
      };
      res.status(500).json(response);
    }
  }

  async getPestsByLivestock(req: Request, res: Response) {
    try {
      const pests = await pestService.getPestsByLivestock(
        req.params.livestockId,
      );
      const response: ApiResponse<typeof pests> = {
        success: true,
        data: pests,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch pests for livestock",
      };
      res.status(500).json(response);
    }
  }

  async getPestTypes(req: Request, res: Response) {
    try {
      const types = await pestService.getPestTypes();
      const response: ApiResponse<typeof types> = {
        success: true,
        data: types,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch pest types",
      };
      res.status(500).json(response);
    }
  }
}
