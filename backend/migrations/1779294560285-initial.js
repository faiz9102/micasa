/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class Initial1779294560285 {
    name = 'Initial1779294560285'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" character varying(11),
                "password" character varying NOT NULL,
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."properties_propertytype_enum" AS ENUM('flat', 'house', 'plot')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."properties_purpose_enum" AS ENUM('rent', 'sale')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."properties_furnishingstatus_enum" AS ENUM('furnished', 'semi_furnished', 'unfurnished')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."properties_rentalscope_enum" AS ENUM('single_floor', 'full_house')
        `);
        await queryRunner.query(`
            CREATE TABLE "properties" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "ownerId" uuid NOT NULL,
                "propertyType" "public"."properties_propertytype_enum" NOT NULL,
                "purpose" "public"."properties_purpose_enum" NOT NULL,
                "city" character varying(100) NOT NULL,
                "area" double precision NOT NULL,
                "price" double precision NOT NULL,
                "description" text NOT NULL,
                "imageUrls" text array NOT NULL DEFAULT '{}',
                "amenities" text array,
                "bedrooms" integer,
                "furnishingStatus" "public"."properties_furnishingstatus_enum",
                "rentalScope" "public"."properties_rentalscope_enum",
                "floorNumber" integer,
                "isActive" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."inquiries_status_enum" AS ENUM('new', 'contacted', 'scheduled_visit', 'closed')
        `);
        await queryRunner.query(`
            CREATE TABLE "inquiries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "propertyId" uuid NOT NULL,
                "tenantId" uuid NOT NULL,
                "status" "public"."inquiries_status_enum" NOT NULL DEFAULT 'new',
                "requestedVisitDate" date,
                "requestedVisitTime" TIME,
                "scheduledVisitDate" date,
                "scheduledVisitTime" TIME,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ceacaa439988b25eb9459e694d9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_inquiries_property_tenant" ON "inquiries" ("propertyId", "tenantId")
        `);
        await queryRunner.query(`
            CREATE TABLE "favourites" (
                "id" SERIAL NOT NULL,
                "propertyId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_173e5d5cc35490bf1de2d2d3739" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_favourites_property_user" ON "favourites" ("propertyId", "userId")
        `);
        await queryRunner.query(`
            ALTER TABLE "properties"
            ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "inquiries"
            ADD CONSTRAINT "FK_3c90e8061b392ff6c388a52fed2" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "inquiries"
            ADD CONSTRAINT "FK_47ea22fe473b153aa595e8a15e7" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "favourites"
            ADD CONSTRAINT "FK_27aee14ee63cc1c9d6184cf2a3b" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "favourites"
            ADD CONSTRAINT "FK_b75b5e4a2475d03acfe11eac1d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "favourites" DROP CONSTRAINT "FK_b75b5e4a2475d03acfe11eac1d1"
        `);
        await queryRunner.query(`
            ALTER TABLE "favourites" DROP CONSTRAINT "FK_27aee14ee63cc1c9d6184cf2a3b"
        `);
        await queryRunner.query(`
            ALTER TABLE "inquiries" DROP CONSTRAINT "FK_47ea22fe473b153aa595e8a15e7"
        `);
        await queryRunner.query(`
            ALTER TABLE "inquiries" DROP CONSTRAINT "FK_3c90e8061b392ff6c388a52fed2"
        `);
        await queryRunner.query(`
            ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_favourites_property_user"
        `);
        await queryRunner.query(`
            DROP TABLE "favourites"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_inquiries_property_tenant"
        `);
        await queryRunner.query(`
            DROP TABLE "inquiries"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."inquiries_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "properties"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."properties_rentalscope_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."properties_furnishingstatus_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."properties_purpose_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."properties_propertytype_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_role_enum"
        `);
    }
}
