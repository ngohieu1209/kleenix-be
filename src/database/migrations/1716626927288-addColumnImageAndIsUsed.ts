import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnImageAndIsUsed1716626927288 implements MigrationInterface {
    name = 'AddColumnImageAndIsUsed1716626927288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promotion" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" ADD "isUsed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_promotion" DROP COLUMN "isUsed"`);
        await queryRunner.query(`ALTER TABLE "promotion" DROP COLUMN "image"`);
    }

}
