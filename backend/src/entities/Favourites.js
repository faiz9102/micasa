import { EntitySchema } from "typeorm";

const FavouriteSchema = new EntitySchema({
  name: "Favourite",
  tableName: "favourites",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: true,
    },
    propertyId: {
      type: "uuid",
    },
    userId: {
      type: "uuid",
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "userId",
      },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_favourites_property_user",
      unique: true,
      columns: ["propertyId", "userId"],
    },
  ],
});

export default FavouriteSchema;
