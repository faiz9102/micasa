import { z } from "zod";

export const inquiryStatusSchema = z.enum([
  "new",
  "contacted",
  "scheduled_visit",
  "closed",
]);

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
  .refine((value) => {
    const date = new Date(value);
    return Number.isFinite(date.getTime());
  }, "Invalid date value");

const timeSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "Invalid time format")
  .refine((value) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }, "Invalid time value");

export const inquiryCreateSchema = z.object({
  requestedVisitDate: dateSchema,
  requestedVisitTime: timeSchema,
});

export const inquiryScheduleSchema = z.object({
  scheduledVisitDate: dateSchema,
  scheduledVisitTime: timeSchema,
});

export const inquiryRescheduleSchema = z.object({
  requestedVisitDate: dateSchema,
  requestedVisitTime: timeSchema,
});
