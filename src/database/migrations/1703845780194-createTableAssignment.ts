import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAssignment1703845780194 implements MigrationInterface {
    name = 'CreateTableAssignment1703845780194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assignment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "assigned_time" TIMESTAMP NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "ratting" integer, "house_worker_id" integer, "booking_id" integer, CONSTRAINT "PK_ASSIGNMENT" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_HOUSE_WORKER_TABLE_ASSIGNMENT" FOREIGN KEY ("house_worker_id") REFERENCES "house_worker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_BOOKING_TABLE_ASSIGNMENT" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_BOOKING_TABLE_ASSIGNMENT"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_HOUSE_WORKER_TABLE_ASSIGNMENT"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
    }

}
