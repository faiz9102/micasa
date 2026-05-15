import AppDataSource from "../configs/data-source.js";
import Users, { UserRole } from "../entities/User.js";

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

  async countAdmins() {
    return this.count({ where: { role: UserRole.ADMIN } });
  },

  async createUser(user) {
    const newUser = this.create(user);

    return this.save(newUser);
  },

  async findByEmail(email) {
    return this.findOne({ where: { email } });
  },

  async findByName(name) {
    return this.findOne({ where: { name } });
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
