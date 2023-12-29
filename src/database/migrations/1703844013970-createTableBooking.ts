import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableBooking1703844013970 implements MigrationInterface {
    name = 'CreateTableBooking1703844013970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."BOOKING_STATUS_ENUM" AS ENUM('PENDING', 'CONFIRMED', 'MODIFIED', 'CANCELLED BY USER', 'CANCELLED BY KLEENIX', 'NO SHOW', 'COMPLETED', 'DELAYED')`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "duration" integer NOT NULL, "note" character varying, "date_time" TIMESTAMP NOT NULL, "total_price" numeric(10,0) NOT NULL DEFAULT '0', "status" "public"."BOOKING_STATUS_ENUM" NOT NULL, "address_id" integer, "package_id" integer, CONSTRAINT "PK_BOOKING" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "is_default" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "extra_service" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_ADDRESS_TABLE_BOOKING" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_PACKAGE_TABLE_BOOKING" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_PACKAGE_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_ADDRESS_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "extra_service" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ALTER COLUMN "is_default" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TYPE "public"."BOOKING_STATUS_ENUM"`);
    }

}
