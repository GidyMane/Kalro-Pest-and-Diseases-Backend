import { Request, Response } from "express";
import { CropService } from "../services/crop.service";
import { ApiResponse } from "../types";

const cropService = new CropService();

export class CropController {
  async createCrop(req: Request, res: Response) {
    try {
      const crop = await cropService.createCrop(req.body);
      const response: ApiResponse<typeof crop> = {
        success: true,
        data: crop,
        message: "Crop created successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create crop",
      };
      res.status(400).json(response);
    }
  }

  async getCrops(req: Request, res: Response) {
    try {
      const { page, limit, query, category } = req.query;
      const result = await cropService.getCrops({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        query: query as string,
        category: category as string,
      });

      const response: ApiResponse<typeof result.crops> = {
        success: true,
        data: result.crops,
        pagination: result.pagination,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch crops",
      };
      res.status(500).json(response);
    }
  }

  async getCropById(req: Request, res: Response) {
    try {
      const crop = await cropService.getCropById(req.params.id);
      if (!crop) {
        const response: ApiResponse<null> = {
          success: false,
          error: "Crop not found",
        };
        return res.status(404).json(response);
      }

      const response: ApiResponse<typeof crop> = {
        success: true,
        data: crop,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch crop",
      };
      res.status(500).json(response);
    }
  }

  async updateCrop(req: Request, res: Response) {
    try {
      const crop = await cropService.updateCrop(req.params.id, req.body);
      const response: ApiResponse<typeof crop> = {
        success: true,
        data: crop,
        message: "Crop updated successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update crop",
      };
      res.status(400).json(response);
    }
  }

  async deleteCrop(req: Request, res: Response) {
    try {
      await cropService.deleteCrop(req.params.id);
      const response: ApiResponse<null> = {
        success: true,
        message: "Crop deleted successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete crop",
      };
      res.status(400).json(response);
    }
  }

  async addPestToCrop(req: Request, res: Response) {
    try {
      const { cropId, pestId } = req.params;
      const result = await cropService.addPestToCrop(cropId, pestId);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: "Pest added to crop successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add pest to crop",
      };
      res.status(400).json(response);
    }
  }

  async removePestFromCrop(req: Request, res: Response) {
    try {
      const { cropId, pestId } = req.params;
      await cropService.removePestFromCrop(cropId, pestId);
      const response: ApiResponse<null> = {
        success: true,
        message: "Pest removed from crop successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove pest from crop",
      };
      res.status(400).json(response);
    }
  }

  async addDiseaseToCrop(req: Request, res: Response) {
    try {
      const { cropId, diseaseId } = req.params;
      const result = await cropService.addDiseaseToCrop(cropId, diseaseId);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: "Disease added to crop successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to add disease to crop",
      };
      res.status(400).json(response);
    }
  }

  async removeDiseaseFromCrop(req: Request, res: Response) {
    try {
      const { cropId, diseaseId } = req.params;
      await cropService.removeDiseaseFromCrop(cropId, diseaseId);
      const response: ApiResponse<null> = {
        success: true,
        message: "Disease removed from crop successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove disease from crop",
      };
      res.status(400).json(response);
    }
  }

  async getCropCategories(req: Request, res: Response) {
    try {
      const categories = await cropService.getCropCategories();
      const response: ApiResponse<typeof categories> = {
        success: true,
        data: categories,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch crop categories",
      };
      res.status(500).json(response);
    }
  }
}
