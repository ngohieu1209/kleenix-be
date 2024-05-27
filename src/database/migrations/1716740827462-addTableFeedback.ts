import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableFeedback1716740827462 implements MigrationInterface {
    name = 'AddTableFeedback1716740827462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "rating" integer NOT NULL, "feedback" character varying NOT NULL, "customer_id" uuid, "booking_id" uuid, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "ratting"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_CUSTOMER_TABLE_FEEDBACK" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_BOOKING_TABLE_FEEDBACK" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_BOOKING_TABLE_FEEDBACK"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_CUSTOMER_TABLE_FEEDBACK"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "ratting" integer`);
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
