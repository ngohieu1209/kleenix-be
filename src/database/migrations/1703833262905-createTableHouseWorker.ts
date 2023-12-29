import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableHouseWorker1703833262905 implements MigrationInterface {
    name = 'CreateTableHouseWorker1703833262905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."GENDER_ENUM" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "house_worker" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "gender" "public"."GENDER_ENUM" NOT NULL, "manager_id" integer, CONSTRAINT "UQ_HOUSE_WORKER_USERNAME" UNIQUE ("username"), CONSTRAINT "PK_HOUSE_WORKER" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD CONSTRAINT "FK_MANAGER_TABLE_HOUSE_WORKER" FOREIGN KEY ("manager_id") REFERENCES "admin_manager"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house_worker" DROP CONSTRAINT "FK_MANAGER_TABLE_HOUSE_WORKER"`);
        await queryRunner.query(`DROP TABLE "house_worker"`);
        await queryRunner.query(`DROP TYPE "public"."GENDER_ENUM"`);
    }

}
