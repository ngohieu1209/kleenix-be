import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnNotification1720369808818 implements MigrationInterface {
    name = 'AlterColumnNotification1720369808818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_promotion" DROP CONSTRAINT "FK_PROMOTION_TABLE_CUSTOMER_PROMOTION"`);
        await queryRunner.query(`ALTER TYPE "public"."NOTIFICATION_TYPE_ENUM" RENAME TO "NOTIFICATION_TYPE_ENUM_old"`);
        await queryRunner.query(`CREATE TYPE "public"."NOTIFICATION_TYPE_ENUM" AS ENUM('BOOKING MỚI', 'HOÀN TIỀN', 'HOÀN THÀNH', 'NẠP TIỀN', 'ĐANG DI CHUYỂN', 'XÁC NHẬN', 'ĐANG LÀM', 'HỦY BỞI KHÁCH', 'HỦY BỞI KLEENIX', 'PHẢN HỒI', 'THÔNG BÁO CHUNG')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "notification_type" TYPE "public"."NOTIFICATION_TYPE_ENUM" USING "notification_type"::"text"::"public"."NOTIFICATION_TYPE_ENUM"`);
        await queryRunner.query(`DROP TYPE "public"."NOTIFICATION_TYPE_ENUM_old"`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" ADD CONSTRAINT "FK_PROMOTION_TABLE_CUSTOMER_PROMOTION" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_promotion" DROP CONSTRAINT "FK_PROMOTION_TABLE_CUSTOMER_PROMOTION"`);
        await queryRunner.query(`CREATE TYPE "public"."NOTIFICATION_TYPE_ENUM_old" AS ENUM('BOOKING MỚI', 'HOÀN TIỀN', 'HOÀN THÀNH', 'NẠP TIỀN', 'GIAO HÀNG', 'XÁC NHẬN', 'ĐANG LÀM', 'HỦY BỞI KHÁCH', 'HỦY BỞI KLEENIX', 'PHẢN HỒI', 'THÔNG BÁO CHUNG')`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "notification_type" TYPE "public"."NOTIFICATION_TYPE_ENUM_old" USING "notification_type"::"text"::"public"."NOTIFICATION_TYPE_ENUM_old"`);
        await queryRunner.query(`DROP TYPE "public"."NOTIFICATION_TYPE_ENUM"`);
        await queryRunner.query(`ALTER TYPE "public"."NOTIFICATION_TYPE_ENUM_old" RENAME TO "NOTIFICATION_TYPE_ENUM"`);
        await queryRunner.query(`ALTER TABLE "customer_promotion" ADD CONSTRAINT "FK_PROMOTION_TABLE_CUSTOMER_PROMOTION" FOREIGN KEY ("promotion_id") REFERENCES "promotion"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
