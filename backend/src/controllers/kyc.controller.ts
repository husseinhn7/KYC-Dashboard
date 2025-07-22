import { Request, Response } from "express";
import KYCVerificationModel from "../models/kyc.model";

export const getKycCases = async (req: any, res: Response) => {
  let { region, status, filter } = req.query;
  const query: any = {};

  // If not global_admin, always filter by user's region
  if (req.user && req.user.role !== "global_admin") {
    region = req.user.region;
  }

  // Only filter region/status if not "all"
  if (region && region !== "all") query.region = region;
  if (status && status !== "all") query.status = status;

  // If searching by user fields, use aggregate to filter by populated fields
  if (filter) {
    const userMatch: any = {
      $or: [
        { "user.name": { $regex: filter as string, $options: "i" } },
        { "user.email": { $regex: filter as string, $options: "i" } },
      ],
    };

    const kycCases = await KYCVerificationModel.aggregate([
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
  const kycCases = await KYCVerificationModel.find(query).populate({
    path: "user",
    select: "name email",
  });
  return res.status(200).json(kycCases);
};

export const getKycCase = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const kycCase = await KYCVerificationModel.findById(caseId).populate({
    path: "user",
    select: "name email phone region",
  });
  if (!kycCase) return res.status(404).json({ message: "KYC case not found" });
  return res.status(200).json(kycCase);
};

export const approveOrRejectKycCase = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const kycCase = await KYCVerificationModel.findById(caseId);
  if (!kycCase) return res.status(404).json({ message: "KYC case not found" });

  const { action } = req.body;
  if (action === "approved") {
    kycCase.status = "approved";
  } else if (action === "rejected") {
    kycCase.status = "rejected";
  } else if (action === "pending") {
    kycCase.status = "pending";
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }
  kycCase.reason = req.body.reason || "";

  await kycCase.save();
  return res.status(200).json({ message: `KYC case ${action}d` });
};

export const addKycNote = async (req: Request, res: Response) => {
  const caseId = req.params.id;
  const kycCase = await KYCVerificationModel.findById(caseId);
  if (!kycCase) return res.status(404).json({ message: "KYC case not found" });
  (kycCase.notes as Array<string>).push(req.body.content);
  await kycCase.save();
  return res.status(200).json({ message: "Note added" });
};
