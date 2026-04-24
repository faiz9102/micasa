import AppDataSource from "../configs/data-source.js";
import Users from "../entities/User.js";

export const UserRepository = AppDataSource.getRepository(Users).extend({
  async emailExists(email) {
    const user = await this.findOne({ where: { email } });
    return !!user;
  },

  async findActiveUsers() {
    return this.find({ where: { isActive: true } });
  },

  async findInActiveUsers() {
    return this.find({ where: { isActive: false } });
  },

  async createUser(user) {
    const newUser = this.create(user);

    return this.save(newUser);
  },

  async findByEmail(email) {
    return this.findOne({ where: { email } });
  },

  async findById(id) {
    return this.findOne({ where: { id } });
  },

  async deleteUser(id) {
    const user = await this.findById(id);
    if (!user) {
      return false;
    }
    await this.remove(user);
    return true;
  },

  async getByEmailForLogin(email) {
    return this.findOne({
      where: { email },
      select: ["id", "email", "password", "role"],
    });
  },
});
