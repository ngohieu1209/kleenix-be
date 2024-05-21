import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFKPackageInTableBooking1714814477562 implements MigrationInterface {
    name = 'RemoveFKPackageInTableBooking1714814477562'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_PACKAGE_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "package_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "package_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_PACKAGE_TABLE_BOOKING" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
