import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableRole1703823937575 implements MigrationInterface {
    name = 'CreateTableRole1703823937575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_PHONE"`);
        await queryRunner.query(`CREATE TYPE "public"."ROLE_ENUM" AS ENUM('ADMIN', 'MANAGER')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" "public"."ROLE_ENUM" NOT NULL, CONSTRAINT "UQ_ROLE_NAME" UNIQUE ("name"), CONSTRAINT "PK_ROLE" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_USER_PHONE" UNIQUE ("phone_code", "phone_number")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ROLE_TABLE_USER" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ROLE_TABLE_USER"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_USER_PHONE"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."ROLE_ENUM"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_PHONE" UNIQUE ("phone_code", "phone_number")`);
    }

}
