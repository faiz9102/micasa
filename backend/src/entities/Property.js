import { EntitySchema } from "typeorm";

export const PropertyType = {
  FLAT: "flat",
  HOUSE: "house",
  PLOT: "plot",
};

export const ListingPurpose = {
  RENT: "rent",
  SALE: "sale",
};

export const FurnishingStatus = {
  FURNISHED: "furnished",
  SEMI_FURNISHED: "semi_furnished",
  UNFURNISHED: "unfurnished",
};

export const RentalScope = {
  SINGLE_FLOOR: "single_floor",
  FULL_HOUSE: "full_house",
};

const PropertySchema = new EntitySchema({
  name: "Property",
  tableName: "properties",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    ownerId: {
      type: "uuid",
    },
    propertyType: {
      type: "enum",
      enum: Object.values(PropertyType),
    },
    purpose: {
      type: "enum",
      enum: Object.values(ListingPurpose),
    },
    city: {
      type: "varchar",
      length: 100,
    },
    area: {
      type: "float",
    },
    price: {
      type: "float",
    },
    description: {
      type: "text",
    },
    imageUrls: {
      type: "text",
      array: true,
      default: "{}",
    },
    amenities: {
      type: "text",
      array: true,
      nullable: true,
      default: null,
    },
    bedrooms: {
      type: "int",
      nullable: true,
      default: null,
    },
    furnishingStatus: {
      type: "enum",
      enum: Object.values(FurnishingStatus),
      nullable: true,
      default: null,
    },
    rentalScope: {
      type: "enum",
      enum: Object.values(RentalScope),
      nullable: true,
      default: null,
    },
    floorNumber: {
      type: "int",
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
    owner: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "ownerId",
      },
      onDelete: "CASCADE",
    },
  },
});

export default PropertySchema;
