import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAdminManager1703825202453 implements MigrationInterface {
    name = 'CreateTableAdminManager1703825202453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_ROLE_TABLE_USER"`);
        await queryRunner.query(`CREATE TABLE "admin_manager" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "role_id" integer, CONSTRAINT "UQ_ADMIN_MANAGER_USERNAME" UNIQUE ("username"), CONSTRAINT "PK_ADMIN_MANAGER" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD CONSTRAINT "FK_ROLE_TABLE_ADMIN_MANAGER" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP CONSTRAINT "FK_ROLE_TABLE_ADMIN_MANAGER"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role_id" integer`);
        await queryRunner.query(`DROP TABLE "admin_manager"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_ROLE_TABLE_USER" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
