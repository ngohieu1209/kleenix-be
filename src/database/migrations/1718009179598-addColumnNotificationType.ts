import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnNotificationType1718009179598 implements MigrationInterface {
    name = 'AddColumnNotificationType1718009179598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."NOTIFICATION_TYPE_ENUM" AS ENUM('BOOKING MỚI', 'HOÀN TIỀN', 'HOÀN THÀNH', 'NẠP TIỀN', 'GIAO HÀNG', 'XÁC NHẬN', 'ĐANG LÀM', 'HỦY BỞI KHÁCH', 'HỦY BỞI KLEENIX', 'PHẢN HỒI', 'THÔNG BÁO CHUNG')`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "notification_type" "public"."NOTIFICATION_TYPE_ENUM" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "notification_type"`);
        await queryRunner.query(`DROP TYPE "public"."NOTIFICATION_TYPE_ENUM"`);
    }

}
