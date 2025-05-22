import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Software } from "../entity/software-entity.js";
import { StatusCodes } from "http-status-codes";
const softwareRepository = AppDataSource.getRepository(Software);

export const createSoftware = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, accessLevels } = req.body;

    if (!name || !description || !accessLevels) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
      return;
    }

    const software = softwareRepository.create({
      name,
      description,
      accessLevels
    });

    await softwareRepository.save(software);
    res.status(StatusCodes.CREATED).json(software);
    return;
  } catch (error) {
    console.error("Error creating software:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while creating software" });
    return;
  }
};

export const getAllSoftware = async (req: Request, res: Response): Promise<void> => {
  try {
    const software = await softwareRepository.find();
    res.status(StatusCodes.OK).json(software);
  } catch (error) {
    console.error("Error fetching software:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while fetching software" });
  }
};

export const getSoftwareById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const software = await softwareRepository.findOne({ where: { id } });
    
    if (!software) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Software not found" });
      return;
    }
    
    res.status(StatusCodes.OK).json(software);
    return;
  } catch (error) {
    console.error("Error fetching software by ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while fetching software" });
    return;
  }
};

export const updateSoftware = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, accessLevels } = req.body;

    const software = await softwareRepository.findOne({ where: { id } });
    if (!software) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Software not found" });
      return;
    }

    Object.assign(software, { name, description, accessLevels });
    await softwareRepository.save(software);
    res.status(StatusCodes.OK).json(software);
  } catch (error) {
    console.error("Error updating software:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while updating software" });
  }
};

export const deleteSoftware = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const software = await softwareRepository.findOne({ where: { id } });
    
    if (!software) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Software not found" });
      return;
    }

    await softwareRepository.remove(software);
    res.status(StatusCodes.OK).json({ message: "Software deleted successfully" });
  } catch (error) {
    console.error("Error deleting software:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while deleting software" });
  }
};