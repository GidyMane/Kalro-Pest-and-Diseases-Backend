import { Request, Response } from 'express';
import { createTestItem, getTestItems } from '../services/test.services';


export const postTestItem = async (_req: Request, res: Response) => {
  const item = await createTestItem();
  res.status(201).json(item);
};

export const getAllTestItems = async (_req: Request, res: Response) => {
  const items = await getTestItems();
  res.status(200).json(items);
};
