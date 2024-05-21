import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnCodeTableCustomer1716298621254 implements MigrationInterface {
    name = 'AddColumnCodeTableCustomer1716298621254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "code" character varying(10)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "code"`);
    }

}
