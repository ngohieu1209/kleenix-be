import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnEvidenceTableAssignment1720526955224 implements MigrationInterface {
    name = 'AddColumnEvidenceTableAssignment1720526955224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" ADD "evidence" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "evidence"`);
    }

}
