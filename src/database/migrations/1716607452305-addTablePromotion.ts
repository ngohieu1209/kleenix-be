import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTablePromotion1716607452305 implements MigrationInterface {
    name = 'AddTablePromotion1716607452305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "amount" numeric(10,0) NOT NULL DEFAULT '0', "point" numeric(10,0) NOT NULL DEFAULT '0', "discount" numeric(10,0) NOT NULL DEFAULT '0', "description" character varying NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "activate" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_promotion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "priceDiscount" numeric(10,0), "customer_id" uuid, "promotion_id" uuid, "booking_id" uuid, CONSTRAINT "PK_0f06875d7786d9a12a066df577d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" ADD CONSTRAINT "FK_CUSTOMER_TABLE_CUSTOMER_PROMOTION" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" ADD CONSTRAINT "FK_PROMOTION_TABLE_CUSTOMER_PROMOTION" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" ADD CONSTRAINT "FK_BOOKING_TABLE_CUSTOMER_PROMOTION" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_promotion" DROP CONSTRAINT "FK_BOOKING_TABLE_CUSTOMER_PROMOTION"`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" DROP CONSTRAINT "FK_PROMOTION_TABLE_CUSTOMER_PROMOTION"`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" DROP CONSTRAINT "FK_CUSTOMER_TABLE_CUSTOMER_PROMOTION"`);
        await queryRunner.query(`DROP TABLE "customer_promotion"`);
        await queryRunner.query(`DROP TABLE "promotion"`);
    }

}
