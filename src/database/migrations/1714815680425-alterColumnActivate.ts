import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnActivate1714815680425 implements MigrationInterface {
    name = 'AlterColumnActivate1714815680425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" RENAME COLUMN "active" TO "activate"`);
        await queryRunner.query(`ALTER TABLE "extra_service" ALTER COLUMN "activate" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "activate" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "activate" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ALTER COLUMN "activate" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "service" ALTER COLUMN "activate" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "extra_service" ALTER COLUMN "activate" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "service" RENAME COLUMN "activate" TO "active"`);
    }

}
