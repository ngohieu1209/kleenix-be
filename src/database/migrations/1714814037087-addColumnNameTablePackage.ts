import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnNameTablePackage1714814037087 implements MigrationInterface {
    name = 'AddColumnNameTablePackage1714814037087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ADD "name" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "name"`);
    }

}
