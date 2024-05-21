import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableBookingPackage1714814563469 implements MigrationInterface {
    name = 'AddTableBookingPackage1714814563469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking_package" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "quantity" integer, "booking_id" uuid, "package_id" uuid, CONSTRAINT "PK_db49f062a75c09949ba1287e294" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking_package" ADD CONSTRAINT "FK_BOOKING_TABLE_BOOKING_PACKAGE" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_package" ADD CONSTRAINT "FK_PACKAGE_TABLE_BOOKING_PACKAGE" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_package" DROP CONSTRAINT "FK_PACKAGE_TABLE_BOOKING_PACKAGE"`);
        await queryRunner.query(`ALTER TABLE "booking_package" DROP CONSTRAINT "FK_BOOKING_TABLE_BOOKING_PACKAGE"`);
        await queryRunner.query(`DROP TABLE "booking_package"`);
    }

}
