import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIcon1714925013266 implements MigrationInterface {
    name = 'AddColumnIcon1714925013266'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_ADDRESS_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "extra_service" ADD "icon" character varying`);
        await queryRunner.query(`ALTER TABLE "service" ADD "icon" character varying`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_ADDRESS_TABLE_BOOKING" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_ADDRESS_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "extra_service" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_ADDRESS_TABLE_BOOKING" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
