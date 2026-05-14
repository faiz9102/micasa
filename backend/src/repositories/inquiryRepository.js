import AppDataSource from "../configs/data-source.js";
import Inquiry from "../entities/Inquiry.js";

export const InquiryRepository = AppDataSource.getRepository(Inquiry).extend({
  async createInquiry(inquiryData) {
    const inquiry = this.create(inquiryData);
    return this.save(inquiry);
  },

  async findById(id) {
    return this.findOne({ where: { id } });
  },

  async findByPropertyAndTenant(propertyId, tenantId) {
    return this.findOne({ where: { propertyId, tenantId } });
  },

  async findByPropertyId(propertyId) {
    return this.find({ where: { propertyId } });
  },

  async saveInquiry(inquiry) {
    return this.save(inquiry);
  },
});
