import { Router } from "express";
import {
  closePropertyInquiry,
  createPropertyInquiry,
  listPropertyInquiries,
  rescheduleInquiry,
  scheduleInquiry,
} from "../controllers/inquiryController.js";
import { requireAuth, requireBuyerOrAdminAccess } from "../middlewares/authMiddleware.js";
import {
  requireInquiryTenant,
  requirePropertyOwnerOrAdmin,
  requireSellerOrAdminAccess,
  validateInquiryCreationRequest,
  validateInquiryRescheduleRequest,
  validateInquiryScheduleRequest,
} from "../middlewares/inquiryMiddleware.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  requireAuth,
  requireBuyerOrAdminAccess,
  validateInquiryCreationRequest,
  createPropertyInquiry()
);

router.get(
  "/",
  requireAuth,
  requirePropertyOwnerOrAdmin,
  listPropertyInquiries()
);

router.patch(
  "/:inquiryId/contact",
  requireAuth,
  requirePropertyOwnerOrAdmin,
  requireSellerOrAdminAccess,
  validateInquiryScheduleRequest,
  scheduleInquiry()
);

router.patch(
  "/:inquiryId/reschedule-request",
  requireAuth,
  requireBuyerOrAdminAccess,
  requireInquiryTenant,
  validateInquiryRescheduleRequest,
  rescheduleInquiry()
);

router.patch(
  "/:inquiryId/close",
  requireAuth,
  requirePropertyOwnerOrAdmin,
  requireSellerOrAdminAccess,
  closePropertyInquiry()
);

export default router;
