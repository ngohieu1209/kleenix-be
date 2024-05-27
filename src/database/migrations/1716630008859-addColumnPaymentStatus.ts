import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnPaymentStatus1716630008859 implements MigrationInterface {
    name = 'AddColumnPaymentStatus1716630008859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."PAYMENT_STATUS_ENUM" AS ENUM('CASH', 'KPAY')`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "payment_status" "public"."PAYMENT_STATUS_ENUM" NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."BOOKING_STATUS_ENUM" RENAME TO "BOOKING_STATUS_ENUM_old"`);
        await queryRunner.query(`CREATE TYPE "public"."BOOKING_STATUS_ENUM" AS ENUM('PENDING', 'CONFIRMED', 'WORKING', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_KLEENIX', 'DELIVERY', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" TYPE "public"."BOOKING_STATUS_ENUM" USING "status"::"text"::"public"."BOOKING_STATUS_ENUM"`);
        await queryRunner.query(`DROP TYPE "public"."BOOKING_STATUS_ENUM_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."BOOKING_STATUS_ENUM_old" AS ENUM('PENDING', 'CONFIRMED', 'MODIFIED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_KLEENIX', 'NO_SHOW', 'COMPLETED', 'DELAYED')`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" TYPE "public"."BOOKING_STATUS_ENUM_old" USING "status"::"text"::"public"."BOOKING_STATUS_ENUM_old"`);
        await queryRunner.query(`DROP TYPE "public"."BOOKING_STATUS_ENUM"`);
        await queryRunner.query(`ALTER TYPE "public"."BOOKING_STATUS_ENUM_old" RENAME TO "BOOKING_STATUS_ENUM"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."PAYMENT_STATUS_ENUM"`);
    }

}
