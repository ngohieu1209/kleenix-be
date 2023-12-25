import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnVerifyAndRemoveEmail1703231280647 implements MigrationInterface {
    name = 'AddColumnVerifyAndRemoveEmail1703231280647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_user_address"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "email" TO "verify"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verify"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verify" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_user_table_address" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_user_table_address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verify"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "verify" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "verify" TO "email"`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_user_address" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
