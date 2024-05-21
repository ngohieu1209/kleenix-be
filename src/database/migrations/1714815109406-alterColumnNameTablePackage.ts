import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnNameTablePackage1714815109406 implements MigrationInterface {
    name = 'AlterColumnNameTablePackage1714815109406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "package" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "package" ADD "name" integer NOT NULL`);
    }

}
