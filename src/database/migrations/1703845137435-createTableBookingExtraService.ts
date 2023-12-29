import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableBookingExtraService1703845137435 implements MigrationInterface {
    name = 'CreateTableBookingExtraService1703845137435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "booking_extra_service" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "booking_id" integer, "extra_service_id" integer, CONSTRAINT "PK_BOOKING_EXTRA_SERVICE" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE" FOREIGN KEY ("extra_service_id") REFERENCES "extra_service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`DROP TABLE "booking_extra_service"`);
    }

}
