import { Router } from "express";
import { CropController } from "../controllers/crop.controller";

const router = Router();
const cropController = new CropController();

// Basic CRUD routes
router.post("/", cropController.createCrop);
router.get("/", cropController.getCrops);
router.get("/categories", cropController.getCropCategories);
router.get("/:id", cropController.getCropById);
router.put("/:id", cropController.updateCrop);
router.delete("/:id", cropController.deleteCrop);

// Relationship management routes
router.post("/:cropId/pests/:pestId", cropController.addPestToCrop);
router.delete("/:cropId/pests/:pestId", cropController.removePestFromCrop);
router.post("/:cropId/diseases/:diseaseId", cropController.addDiseaseToCrop);
router.delete(
  "/:cropId/diseases/:diseaseId",
  cropController.removeDiseaseFromCrop,
);

export default router;
