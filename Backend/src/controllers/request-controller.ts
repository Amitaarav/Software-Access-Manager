import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { Request as AccessRequest } from "../entity/request-entity.js";
import { RequestHistory } from "../entity/request-history-entity.js";
import { User } from "../entity/user-entity.js";
import { Software } from "../entity/software-entity.js";
import { StatusCodes } from "http-status-codes";

const requestRepository = AppDataSource.getRepository(AccessRequest);
const userRepository = AppDataSource.getRepository(User);
const softwareRepository = AppDataSource.getRepository(Software);
const requestHistoryRepository = AppDataSource.getRepository(RequestHistory);

export const createRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user?.id;

    if (!softwareId || !accessType || !reason) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
      return;
    }

    // Verify user exists
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    // Verify software exists
    const software = await softwareRepository.findOne({ where: { id: softwareId } });
    if (!software) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Software not found" });
      return;
    }

    // Check if the requested access type is valid for this software
    if (!software.accessLevels.includes(accessType)) {
      res.status(StatusCodes.BAD_REQUEST).json({ 
        message: `Invalid access type. Available types: ${software.accessLevels.join(", ")}` 
      });
      return;
    }

    // Create new request
    const accessRequest = requestRepository.create({
      userId,
      softwareId,
      accessType,
      reason,
      status: "Pending"
    });

    await requestRepository.save(accessRequest);
    res.status(StatusCodes.CREATED).json(accessRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while creating request" });
  }
};

export const getUserRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const requests = await requestRepository.find({
      where: { userId },
      relations: ["software"]
    });
    
    res.status(StatusCodes.OK).json(requests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
};

export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await requestRepository.find({
      where: { status: "Pending" },
      relations: ["user", "software"]
    });
    
    res.status(StatusCodes.OK).json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while fetching pending requests" });
  }
};

export const updateRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const managerId = req.user?.id;

    if (!status || !["Approved", "Rejected"].includes(status)) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Valid status (Approved/Rejected) is required" });
      return;
    }

    const request = await requestRepository.findOne({ 
      where: { id: parseInt(id) },
      relations: ["user", "software"]
    });

    if (!request) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Request not found" });
      return;
    }

    // Create history record
    const historyRecord = requestHistoryRepository.create({
      requestId: request.id,
      changedById: managerId!,
      oldStatus: request.status,
      newStatus: status as "Approved" | "Rejected",
      comment: comment || null
    });

    // Update request status
    const oldStatus = request.status;
    request.status = status as "Approved" | "Rejected";
    request.updatedAt = new Date();
    
    await Promise.all([
      requestRepository.save(request),
      requestHistoryRepository.save(historyRecord)
    ]);

    res.status(StatusCodes.OK).json({
      request,
      history: historyRecord
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while updating request" });
  }
};

export const getRequestHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;

    const history = await requestHistoryRepository.find({
      where: { requestId: parseInt(requestId) },
      relations: ["changedBy"],
      order: { changedAt: "DESC" }
    });

    res.status(StatusCodes.OK).json(history);
  } catch (error) {
    console.error("Error fetching request history:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while fetching request history" });
  }
};

export const getAllRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const requests = await requestRepository.find({
      relations: ["user", "software"]
    });
    res.status(StatusCodes.OK).json(requests);
  } catch (error) {
    console.error("Error fetching all requests:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while fetching requests" });
  }
};

export const deleteRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await requestRepository.findOne({ 
      where: { id: parseInt(id) }
    });

    if (!request) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Request not found" });
      return;
    }

    await requestRepository.remove(request);
    res.status(StatusCodes.OK).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error while deleting request" });
  }
};