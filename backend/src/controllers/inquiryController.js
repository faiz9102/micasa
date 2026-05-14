import {
  closeInquiry,
  createInquiry,
  getInquiriesByProperty,
  getInquiryById,
  rescheduleInquiryByTenant,
  scheduleInquiryBySeller,
} from "../services/inquiryService.js";

export const createPropertyInquiry = () => {
  return async (req, res) => {
    const user = req?.middleware?.user;

    if (!user?.id) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const result = await createInquiry({
      propertyId: req.params.id,
      tenantId: user.id,
      requestedVisitDate: req.inquiry.requestedVisitDate,
      requestedVisitTime: req.inquiry.requestedVisitTime,
      allowInactive: user.role === "admin",
    });

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "DUPLICATE") {
      return res.status(409).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(201).json({ status: "success", inquiry: result.inquiry });
  };
};

export const listPropertyInquiries = () => {
  return async (req, res) => {
    const result = await getInquiriesByProperty(req.params.id);

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", inquiries: result.inquiries });
  };
};

export const scheduleInquiry = () => {
  return async (req, res) => {
    const isAdmin = req?.middleware?.user?.role === "admin";
    const inquiryResult = await getInquiryById(req.params.inquiryId);

    if (!inquiryResult.success && inquiryResult.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: inquiryResult.message });
    }

    if (!inquiryResult.success) {
      return res.status(500).json({ status: "fail", message: inquiryResult.message });
    }

    if (inquiryResult.inquiry.propertyId !== req.params.id) {
      return res.status(404).json({ status: "fail", message: "Inquiry not found" });
    }

    const result = await scheduleInquiryBySeller(
      req.params.inquiryId,
      req.inquiry.scheduledVisitDate,
      req.inquiry.scheduledVisitTime,
      isAdmin
    );

    if (!result.success && result.code === "INVALID_STATUS") {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", inquiry: result.inquiry });
  };
};

export const rescheduleInquiry = () => {
  return async (req, res) => {
    const tenantId = req?.middleware?.user?.id;

    if (!tenantId) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const inquiryResult = await getInquiryById(req.params.inquiryId);

    if (!inquiryResult.success && inquiryResult.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: inquiryResult.message });
    }

    if (!inquiryResult.success) {
      return res.status(500).json({ status: "fail", message: inquiryResult.message });
    }

    if (inquiryResult.inquiry.propertyId !== req.params.id) {
      return res.status(404).json({ status: "fail", message: "Inquiry not found" });
    }

    const result = await rescheduleInquiryByTenant(
      req.params.inquiryId,
      tenantId,
      req.inquiry.requestedVisitDate,
      req.inquiry.requestedVisitTime
    );

    if (!result.success && result.code === "INVALID_STATUS") {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "FORBIDDEN") {
      return res.status(403).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", inquiry: result.inquiry });
  };
};

export const closePropertyInquiry = () => {
  return async (req, res) => {
    const isAdmin = req?.middleware?.user?.role === "admin";
    const inquiryResult = await getInquiryById(req.params.inquiryId);

    if (!inquiryResult.success && inquiryResult.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: inquiryResult.message });
    }

    if (!inquiryResult.success) {
      return res.status(500).json({ status: "fail", message: inquiryResult.message });
    }

    if (inquiryResult.inquiry.propertyId !== req.params.id) {
      return res.status(404).json({ status: "fail", message: "Inquiry not found" });
    }

    const result = await closeInquiry(req.params.inquiryId, isAdmin);

    if (!result.success && result.code === "INVALID_STATUS") {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    if (!result.success && result.code === "NOT_FOUND") {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.status(200).json({ status: "success", inquiry: result.inquiry });
  };
};
