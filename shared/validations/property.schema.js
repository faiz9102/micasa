import { z } from "zod";

export const propertyTypeSchema = z.enum(["flat", "house", "plot"]);
export const purposeSchema = z.enum(["rent", "sale"]);
export const furnishingStatusSchema = z.enum(["furnished", "semi_furnished", "unfurnished"]);
export const rentalScopeSchema = z.enum(["single_floor", "full_house"]);

const propertySchema = z
  .object({
    propertyType: propertyTypeSchema,
    purpose: purposeSchema,
    city: z.string().trim().min(1, "City is required"),
    area: z.coerce.number().positive("Area must be greater than 0"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    description: z.string().trim().min(1, "Description is required"),
    imageUrls: z.array(z.string().url("Invalid image URL")).min(1, "At least one image URL is required"),
    amenities: z.array(z.string().trim().min(1, "Amenity cannot be empty")).optional(),
    bedrooms: z.coerce.number().int().positive("Bedrooms must be a positive number").optional(),
    furnishingStatus: furnishingStatusSchema.optional(),
    rentalScope: rentalScopeSchema.optional(),
    floorNumber: z.coerce.number().int().min(0, "Floor number cannot be negative").optional(),
  })
  .superRefine((data, ctx) => {
    const isRent = data.purpose === "rent";

    if (data.propertyType === "plot") {
      if (data.purpose !== "sale") {
        ctx.addIssue({
          path: ["purpose"],
          code: z.ZodIssueCode.custom,
          message: "Plot can only be listed for sale",
        });
      }

      if (typeof data.bedrooms !== "undefined") {
        ctx.addIssue({
          path: ["bedrooms"],
          code: z.ZodIssueCode.custom,
          message: "Bedrooms are not allowed for plot",
        });
      }

      if (typeof data.furnishingStatus !== "undefined") {
        ctx.addIssue({
          path: ["furnishingStatus"],
          code: z.ZodIssueCode.custom,
          message: "Furnishing status is not allowed for plot",
        });
      }

      if (typeof data.rentalScope !== "undefined") {
        ctx.addIssue({
          path: ["rentalScope"],
          code: z.ZodIssueCode.custom,
          message: "Rental scope is not allowed for plot",
        });
      }

      if (typeof data.floorNumber !== "undefined") {
        ctx.addIssue({
          path: ["floorNumber"],
          code: z.ZodIssueCode.custom,
          message: "Floor number is not allowed for plot",
        });
      }

      return;
    }

    if (typeof data.bedrooms === "undefined") {
      ctx.addIssue({
        path: ["bedrooms"],
        code: z.ZodIssueCode.custom,
        message: "Bedrooms are required for flat and house",
      });
    }

    if (typeof data.furnishingStatus === "undefined") {
      ctx.addIssue({
        path: ["furnishingStatus"],
        code: z.ZodIssueCode.custom,
        message: "Furnishing status is required for flat and house",
      });
    }

    if (isRent) {
      if (typeof data.rentalScope === "undefined") {
        ctx.addIssue({
          path: ["rentalScope"],
          code: z.ZodIssueCode.custom,
          message: "Rental scope is required for rent listings",
        });
      }
    } else if (typeof data.rentalScope !== "undefined") {
      ctx.addIssue({
        path: ["rentalScope"],
        code: z.ZodIssueCode.custom,
        message: "Rental scope is only allowed for rent listings",
      });
    }

    if (data.propertyType === "flat") {
      if (typeof data.floorNumber === "undefined") {
        ctx.addIssue({
          path: ["floorNumber"],
          code: z.ZodIssueCode.custom,
          message: "Floor number is required for flat",
        });
      }

      return;
    }

    if (!isRent || data.rentalScope === "full_house") {
      if (typeof data.floorNumber !== "undefined") {
        ctx.addIssue({
          path: ["floorNumber"],
          code: z.ZodIssueCode.custom,
          message: "Floor number is only allowed for single-floor house rentals",
        });
      }
    }

    if (isRent && data.rentalScope === "single_floor" && typeof data.floorNumber === "undefined") {
      ctx.addIssue({
        path: ["floorNumber"],
        code: z.ZodIssueCode.custom,
        message: "Floor number is required for single-floor house rentals",
      });
    }
  });

export default propertySchema;
