import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableNotification1717944653993 implements MigrationInterface {
    name = 'AddTableNotification1717944653993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "body" text NOT NULL, "isMark" boolean NOT NULL DEFAULT false, "customer_id" uuid, "house_worker_id" uuid, "booking_id" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_CUSTOMER_TABLE_NOTIFICATION" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_HOUSE_WORKER_TABLE_NOTIFICATION" FOREIGN KEY ("house_worker_id") REFERENCES "house_worker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_BOOKING_TABLE_NOTIFICATION" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_BOOKING_TABLE_NOTIFICATION"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_HOUSE_WORKER_TABLE_NOTIFICATION"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_CUSTOMER_TABLE_NOTIFICATION"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
