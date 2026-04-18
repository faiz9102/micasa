import { EntitySchema } from 'typeorm';

export const UserRole = {
  ADMIN: 'admin',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
};

export const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 100,
    },
    email: {
      type: 'varchar',
      unique: true,
    },
    password: {
      type: 'varchar',
      select: false,
    },
    role: {
      type: 'enum',
      enum: Object.values(UserRole),
      default: UserRole.TENANT,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
});

export default UserSchema;