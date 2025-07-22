import { Request, Response } from 'express';
import auditModel from '../models/audit.model';
import { AuthRequest } from '../middlewares/auth.middleware';





export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  if (req.user.role !== 'global_admin') {
    req.query.role = req.user.role; 
  }
  const { status, filter } = req.query;
  const query: any = {};

  // Only filter region/status if not "all"
  if (status && status !== "all") query.status = status;

  // If searching by user fields, use aggregate to filter by populated fields
  if (filter) {
    const userMatch: any = {
      $or: [
        { "user.name": { $regex: filter as string, $options: "i" } },
        { "user.email": { $regex: filter as string, $options: "i" } },
      ],
    };

    const kycCases = await auditModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: userMatch },
      {
        $project: {
          _id: 1,
          status: 1,
          region: 1,
          notes: 1,
          user: { name: 1, email: 1, _id: 1 },
        },
      },
    ]);
    return res.status(200).json(kycCases);
  }

  // Default: filter by region/status only, or return all if both are "all"
  const kycCases = await auditModel.find(query).populate({
    path: "user",
    select: "name email",
  });
  return res.status(200).json(kycCases);
};