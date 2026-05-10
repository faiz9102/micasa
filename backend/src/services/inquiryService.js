import { InquiryStatus } from "../entities/Inquiry.js";
import { InquiryRepository } from "../repositories/inquiryRepository.js";
import { PropertyRepository } from "../repositories/propertyRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

const buildInquiryResponse = (inquiry, tenant, owner) => ({
  ...inquiry,
  tenant: tenant
    ? {
        id: tenant.id,
        name: tenant.name,
        email: tenant.email,
        phoneNumber: tenant.phoneNumber,
      }
    : undefined,
  owner: owner
    ? {
        id: owner.id,
        name: owner.name,
        phoneNumber: owner.phoneNumber,
      }
    : undefined,
});

const ensurePropertyOwner = async (inquiry) => {
  const property = await PropertyRepository.findById(inquiry.propertyId);
  if (!property) {
    return null;
  }

  return UserRepository.findById(property.ownerId);
};

export const createInquiry = async ({
  propertyId,
  tenantId,
  requestedVisitDate,
  requestedVisitTime,
  allowInactive = false,
}) => {
  try {
    const property = await PropertyRepository.findById(propertyId);

    if (!property) {
      return { success: false, message: "Property not found", code: "NOT_FOUND" };
    }

    if (!property.isActive && !allowInactive) {
      return { success: false, message: "Property not found", code: "NOT_FOUND" };
    }

    const existingInquiry = await InquiryRepository.findByPropertyAndTenant(propertyId, tenantId);
    if (existingInquiry) {
      return { success: false, message: "Inquiry already exists", code: "DUPLICATE" };
    }

    const inquiry = await InquiryRepository.createInquiry({
      propertyId,
      tenantId,
      status: InquiryStatus.NEW,
      requestedVisitDate,
      requestedVisitTime,
    });

    const tenant = await UserRepository.findById(tenantId);
    const owner = await UserRepository.findById(property.ownerId);

    return { success: true, inquiry: buildInquiryResponse(inquiry, tenant, owner) };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const getInquiriesByProperty = async (propertyId) => {
  try {
    const inquiries = await InquiryRepository.findByPropertyId(propertyId);
    const owner = inquiries.length > 0 ? await ensurePropertyOwner(inquiries[0]) : null;
    const responses = await Promise.all(
      inquiries.map(async (inquiry) => {
        const tenant = await UserRepository.findById(inquiry.tenantId);
        return buildInquiryResponse(inquiry, tenant, owner);
      })
    );

    return { success: true, inquiries: responses };
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const getInquiryById = async (id) => {
  try {
    const inquiry = await InquiryRepository.findById(id);
    if (!inquiry) {
      return { success: false, message: "Inquiry not found", code: "NOT_FOUND" };
    }

    return { success: true, inquiry };
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const getInquiryWithOwner = async (id) => {
  try {
    const inquiry = await InquiryRepository.findById(id);
    if (!inquiry) {
      return { success: false, message: "Inquiry not found", code: "NOT_FOUND" };
    }

    const tenant = await UserRepository.findById(inquiry.tenantId);
    const owner = await ensurePropertyOwner(inquiry);
    const response = buildInquiryResponse(inquiry, tenant, owner);

    return { success: true, inquiry: response };
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const rescheduleInquiryByTenant = async (inquiryId, tenantId, requestedVisitDate, requestedVisitTime) => {
  try {
    const inquiry = await InquiryRepository.findById(inquiryId);
    if (!inquiry) {
      return { success: false, message: "Inquiry not found", code: "NOT_FOUND" };
    }

    if (inquiry.tenantId !== tenantId) {
      return { success: false, message: "Forbidden", code: "FORBIDDEN" };
    }

    if (![InquiryStatus.CONTACTED, InquiryStatus.SCHEDULED_VISIT].includes(inquiry.status)) {
      return { success: false, message: "Invalid inquiry status", code: "INVALID_STATUS" };
    }

    inquiry.requestedVisitDate = requestedVisitDate;
    inquiry.requestedVisitTime = requestedVisitTime;
    inquiry.status = InquiryStatus.CONTACTED;
    inquiry.scheduledVisitDate = null;
    inquiry.scheduledVisitTime = null;

    const updated = await InquiryRepository.saveInquiry(inquiry);
    const tenant = await UserRepository.findById(updated.tenantId);
    const owner = await ensurePropertyOwner(updated);
    return { success: true, inquiry: buildInquiryResponse(updated, tenant, owner) };
  } catch (error) {
    console.error("Error rescheduling inquiry:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const scheduleInquiryBySeller = async (inquiryId, scheduledVisitDate, scheduledVisitTime, isAdmin) => {
  try {
    const inquiry = await InquiryRepository.findById(inquiryId);
    if (!inquiry) {
      return { success: false, message: "Inquiry not found", code: "NOT_FOUND" };
    }

    if (!isAdmin) {
      if (inquiry.status === InquiryStatus.CLOSED) {
        return { success: false, message: "Invalid inquiry status", code: "INVALID_STATUS" };
      }

      if (![InquiryStatus.NEW, InquiryStatus.CONTACTED].includes(inquiry.status)) {
        return { success: false, message: "Invalid inquiry status", code: "INVALID_STATUS" };
      }
    }

    inquiry.scheduledVisitDate = scheduledVisitDate;
    inquiry.scheduledVisitTime = scheduledVisitTime;

    if (isAdmin) {
      if (inquiry.status === InquiryStatus.NEW) {
        inquiry.status = InquiryStatus.CONTACTED;
      } else if (inquiry.status === InquiryStatus.CONTACTED) {
        inquiry.status = InquiryStatus.SCHEDULED_VISIT;
      } else if (inquiry.status === InquiryStatus.SCHEDULED_VISIT) {
        inquiry.status = InquiryStatus.SCHEDULED_VISIT;
      } else if (inquiry.status === InquiryStatus.CLOSED) {
        inquiry.status = InquiryStatus.CONTACTED;
      }
    } else if (inquiry.status === InquiryStatus.NEW) {
      inquiry.status = InquiryStatus.CONTACTED;
    } else {
      inquiry.status = InquiryStatus.SCHEDULED_VISIT;
    }

    const updated = await InquiryRepository.saveInquiry(inquiry);
    const tenant = await UserRepository.findById(updated.tenantId);
    const owner = await ensurePropertyOwner(updated);
    return { success: true, inquiry: buildInquiryResponse(updated, tenant, owner) };
  } catch (error) {
    console.error("Error scheduling inquiry:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};

export const closeInquiry = async (inquiryId, isAdmin) => {
  try {
    const inquiry = await InquiryRepository.findById(inquiryId);
    if (!inquiry) {
      return { success: false, message: "Inquiry not found", code: "NOT_FOUND" };
    }

    if (!isAdmin && inquiry.status !== InquiryStatus.SCHEDULED_VISIT) {
      return { success: false, message: "Invalid inquiry status", code: "INVALID_STATUS" };
    }

    inquiry.status = InquiryStatus.CLOSED;
    const updated = await InquiryRepository.saveInquiry(inquiry);
    const tenant = await UserRepository.findById(updated.tenantId);
    const owner = await ensurePropertyOwner(updated);

    return { success: true, inquiry: buildInquiryResponse(updated, tenant, owner) };
  } catch (error) {
    console.error("Error closing inquiry:", error);
    return { success: false, message: "Internal server error", code: "INTERNAL_ERROR" };
  }
};
