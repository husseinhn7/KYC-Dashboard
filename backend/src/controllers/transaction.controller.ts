import { Request, Response } from "express";
import TransactionModel from "../models/transaction.model";
import kycModel from "../models/kyc.model";
import { AuthRequest } from "../middlewares/auth.middleware";
/**
 * GET /api/transactions/stats
 * Query params:
 *   - region (optional): string
 */
export const getTransactionStats = async (req: AuthRequest, res: Response) => {
  try {
    // Determine region filter based on user role
    let region: string | undefined = req.query.region as string | undefined;
    if (req.user.role !== "global_admin") {
      region = req.user.region;
    }

    const match: Record<string, unknown> = {};
    if (region && region !== "all") match.region = region;

    const [stats] = await TransactionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          totalTransactions: 1,
          successRate: {
            $cond: [
              { $eq: ["$totalTransactions", 0] },
              0,
              { $divide: ["$completed", "$totalTransactions"] },
            ],
          },
        },
      },
    ]);

    const latestTransactions = await TransactionModel.find(match)
      .sort({ timestamp: -1 })
      .limit(5)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    const filterQuery = match;
    const kycCount = await kycModel.countDocuments(filterQuery);
    const kycPending = await kycModel.countDocuments({
      status: "pending",
      ...filterQuery,
    });

    return res.status(200).json({
      totalAmount: stats?.totalAmount || 0,
      totalTransactions: stats?.totalTransactions || 0,
      latestTransactions,
      kycCount,
      kycPending,
    });
  } catch (err) {
    console.error("Failed to fetch transaction stats:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  let { region, status, filter } = req.query;
  const query: any = {};

  // If not global_admin, always filter by user's region
  if (req.user && req.user.role !== "global_admin") {
    region = req.user.region;
  }

  // Only filter region/status if not "all"
  if (region && region !== "all") query.region = region;
  if (status && status !== "all") query.status = status;

  // If searching by sender or receiver name, use aggregate to filter by populated fields
  if (filter) {
    const nameMatch: any = {
      $or: [
        { "sender.name": { $regex: filter as string, $options: "i" } },
        { "receiver.name": { $regex: filter as string, $options: "i" } },
      ],
    };

    const transactions = await TransactionModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      { $unwind: "$sender" },
      {
        $lookup: {
          from: "users",
          localField: "receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      { $unwind: "$receiver" },
      { $match: nameMatch },
      {
        $project: {
          _id: 1,
          status: 1,
          region: 1,
          amount: 1,
          timestamp: 1,
          sender: { name: 1, email: 1, _id: 1 },
          receiver: { name: 1, email: 1, _id: 1 },
        },
      },
    ]);
    return res.status(200).json(transactions);
  }

  // Default: filter by region/status only, or return all if both are "all"
  const transactions = await TransactionModel.find(query)
    .populate({ path: "sender", select: "name email" })
    .populate({ path: "receiver", select: "name email" });
  return res.status(200).json(transactions);
};

export const createTransaction = async (req: Request, res: Response) => {
  // TODO: Create transaction (mock logic)
  res.json({ message: "Transaction created" });
};
