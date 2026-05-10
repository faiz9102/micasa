import {
  inquiryCreateSchema,
  inquiryRescheduleSchema,
  inquiryScheduleSchema,
} from "@micasa/shared/validations/inquiry.schema.js";
import { getPropertyById } from "../services/propertyService.js";
import { getInquiryById } from "../services/inquiryService.js";

export const validateInquiryCreationRequest = (req, res, next) => {
  const result = inquiryCreateSchema.safeParse(req.body);

  if (result.success) {
    req.inquiry = result.data;
    return next();
  }

  return res.status(400).json({
    status: "fail",
    message: "Invalid inquiry data",
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
};

export const validateInquiryScheduleRequest = (req, res, next) => {
  const result = inquiryScheduleSchema.safeParse(req.body);

  if (result.success) {
    req.inquiry = result.data;
    return next();
  }

  return res.status(400).json({
    status: "fail",
    message: "Invalid schedule data",
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
};

export const validateInquiryRescheduleRequest = (req, res, next) => {
  const result = inquiryRescheduleSchema.safeParse(req.body);

  if (result.success) {
    req.inquiry = result.data;
    return next();
  }

  return res.status(400).json({
    status: "fail",
    message: "Invalid reschedule data",
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
};

export const requirePropertyOwnerOrAdmin = async (req, res, next) => {
  const user = req?.middleware?.user;

  if (!user?.id) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (user.role === "admin") {
    return next();
  }

  const propertyId = req?.params?.id;
  const propertyResult = await getPropertyById(propertyId);

  if (!propertyResult.success && propertyResult.code === "NOT_FOUND") {
    return res.status(404).json({ status: "fail", message: propertyResult.message });
  }

  if (!propertyResult.success) {
    return res.status(500).json({ status: "fail", message: propertyResult.message });
  }

  if (propertyResult.property.ownerId !== user.id) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  return next();
};

export const requireSellerOrAdminAccess = (req, res, next) => {
  const user = req?.middleware?.user;

  if (!user?.id) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (user.role === "admin") {
    return next();
  }

  if (user.loggedInAsSeller !== true) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  return next();
};

export const requireInquiryTenant = async (req, res, next) => {
  const user = req?.middleware?.user;

  if (!user?.id) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (user.role === "admin") {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  const inquiryResult = await getInquiryById(req.params.inquiryId);
  if (!inquiryResult.success && inquiryResult.code === "NOT_FOUND") {
    return res.status(404).json({ status: "fail", message: inquiryResult.message });
  }

  if (!inquiryResult.success) {
    return res.status(500).json({ status: "fail", message: inquiryResult.message });
  }

  if (inquiryResult.inquiry.tenantId !== user.id) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  req.inquiryRecord = inquiryResult.inquiry;
  return next();
};
