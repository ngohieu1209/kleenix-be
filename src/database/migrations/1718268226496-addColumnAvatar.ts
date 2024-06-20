import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAvatar1718268226496 implements MigrationInterface {
    name = 'AddColumnAvatar1718268226496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "house_worker" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "avatar"`);
    }

}
