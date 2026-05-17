import { InquiryRepository } from "../repositories/inquiryRepository.js";
import { PropertyRepository } from "../repositories/propertyRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

const toActivityTimestamp = (value) => {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getAdminDashboardSummary = async () => {
  try {
    const [usersResult, propertiesResult, inquiriesResult] = await Promise.allSettled([
      UserRepository.find(),
      PropertyRepository.find({ order: { createdAt: "DESC" } }),
      InquiryRepository.find({ order: { createdAt: "DESC" } }),
    ]);

    const users = usersResult.status === "fulfilled" ? usersResult.value : [];
    const properties = propertiesResult.status === "fulfilled" ? propertiesResult.value : [];
    const inquiries = inquiriesResult.status === "fulfilled" ? inquiriesResult.value : [];

    const usersById = new Map(users.map((user) => [user.id, user]));
    const propertiesById = new Map(properties.map((property) => [property.id, property]));

    const inquiryStats = inquiries.reduce(
      (stats, inquiry) => {
        stats.total += 1;
        stats.byStatus[inquiry.status] = (stats.byStatus[inquiry.status] || 0) + 1;
        return stats;
      },
      {
        total: 0,
        byStatus: {
          new: 0,
          contacted: 0,
          scheduled_visit: 0,
          closed: 0,
        },
      }
    );

    const recentActivity = [
      ...users.map((user) => ({
        type: "account",
        title: `New account: ${user.name}`,
        description: user.email,
        createdAt: user.createdAt,
      })),
      ...properties.map((property) => ({
        type: "listing",
        title: `Listing: ${property.city}`,
        description: `${usersById.get(property.ownerId)?.name || "Unknown seller"} · ${property.isActive ? "Approved" : "Pending review"}`,
        createdAt: property.createdAt,
      })),
      ...inquiries.map((inquiry) => {
        const property = propertiesById.get(inquiry.propertyId);
        const tenant = usersById.get(inquiry.tenantId);

        return {
          type: "inquiry",
          title: `Inquiry: ${inquiry.status}`,
          description: `${tenant?.name || "Unknown buyer"} · ${property?.city || "Unknown property"}`,
          createdAt: inquiry.createdAt,
        };
      }),
    ]
      .sort((left, right) => toActivityTimestamp(right.createdAt) - toActivityTimestamp(left.createdAt))
      .slice(0, 8);

    return {
      success: true,
      summary: {
        totalListings: properties.length,
        pendingListings: properties.filter((property) => !property.isActive).length,
        approvedListings: properties.filter((property) => property.isActive).length,
        totalInquiries: inquiryStats.total,
        inquiryStats: inquiryStats.byStatus,
      },
      recentActivity,
    };
  } catch (error) {
    console.error("Error loading admin dashboard summary:", error);
    return { success: false, message: "Internal server error" };
  }
};