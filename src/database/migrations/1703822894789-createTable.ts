import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1703822894789 implements MigrationInterface {
    name = 'CreateTable1703822894789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "province" character varying NOT NULL, "district" character varying NOT NULL, "ward" character varying NOT NULL, "street" character varying NOT NULL, "long" character varying NOT NULL, "lat" character varying NOT NULL, "is_default" boolean NOT NULL, "user_id" integer, CONSTRAINT "PK_ADDRESS" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "password" character varying NOT NULL, "name" character varying NOT NULL, "phone_code" character varying(3) NOT NULL, "phone_number" character varying(12) NOT NULL, "verify" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_PHONE" UNIQUE ("phone_code", "phone_number"), CONSTRAINT "PK_USER" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "extra_service" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "duration" integer NOT NULL, "description" character varying NOT NULL, "activate" boolean NOT NULL, "price" numeric(10,0) NOT NULL DEFAULT '0', CONSTRAINT "PK_EXTRA_SERVICE" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "active" boolean NOT NULL, CONSTRAINT "PK_SERVICE" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_USER_TABLE_ADDRESS" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_USER_TABLE_ADDRESS"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "extra_service"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
