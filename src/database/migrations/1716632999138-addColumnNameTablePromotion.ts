import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnNameTablePromotion1716632999138 implements MigrationInterface {
    name = 'AddColumnNameTablePromotion1716632999138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotion" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotion" DROP COLUMN "name"`);
    }

}
