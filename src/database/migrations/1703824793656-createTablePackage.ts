import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablePackage1703824793656 implements MigrationInterface {
    name = 'CreateTablePackage1703824793656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "package" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "duration" integer NOT NULL, "room" integer, "description" character varying NOT NULL, "activate" boolean NOT NULL DEFAULT true, "price" numeric(10,0) NOT NULL DEFAULT '0', "service_id" integer, CONSTRAINT "PK_PACKAGE" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "extra_service" ALTER COLUMN "activate" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "active" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_SERVICE_TABLE_PACKAGE" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_SERVICE_TABLE_PACKAGE"`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "active" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "extra_service" ALTER COLUMN "activate" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "package"`);
    }

}
