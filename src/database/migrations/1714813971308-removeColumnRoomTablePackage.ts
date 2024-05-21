import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveColumnRoomTablePackage1714813971308 implements MigrationInterface {
    name = 'RemoveColumnRoomTablePackage1714813971308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "room"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ADD "room" integer`);
    }

}
