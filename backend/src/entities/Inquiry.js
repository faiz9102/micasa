import { EntitySchema } from "typeorm";

export const InquiryStatus = {
  NEW: "new",
  CONTACTED: "contacted",
  SCHEDULED_VISIT: "scheduled_visit",
  CLOSED: "closed",
};

const InquirySchema = new EntitySchema({
  name: "Inquiry",
  tableName: "inquiries",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    propertyId: {
      type: "uuid",
    },
    tenantId: {
      type: "uuid",
    },
    status: {
      type: "enum",
      enum: Object.values(InquiryStatus),
      default: InquiryStatus.NEW,
    },
    requestedVisitDate: {
      type: "date",
      nullable: true,
      default: null,
    },
    requestedVisitTime: {
      type: "time",
      nullable: true,
      default: null,
    },
    scheduledVisitDate: {
      type: "date",
      nullable: true,
      default: null,
    },
    scheduledVisitTime: {
      type: "time",
      nullable: true,
      default: null,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    property: {
      type: "many-to-one",
      target: "Property",
      joinColumn: {
        name: "propertyId",
      },
      onDelete: "CASCADE",
    },
    tenant: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "tenantId",
      },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_inquiries_property_tenant",
      unique: true,
      columns: ["propertyId", "tenantId"],
    },
  ],
});

export default InquirySchema;
