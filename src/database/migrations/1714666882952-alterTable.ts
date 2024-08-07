import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTable1714666882952 implements MigrationInterface {
    name = 'AlterTable1714666882952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_USER_TABLE_ADDRESS"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "customer"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "customer_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_ADDRESS_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_ADDRESS"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_SERVICE_TABLE_PACKAGE"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "PK_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_PACKAGE_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "PK_PACKAGE"`);
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "package" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "service_id"`);
        await queryRunner.query(`ALTER TABLE "package" ADD "service_id" uuid`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP CONSTRAINT "FK_ROLE_TABLE_ADMIN_MANAGER"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "PK_ROLE"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP CONSTRAINT "FK_MANAGER_TABLE_HOUSE_WORKER"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP CONSTRAINT "PK_ADMIN_MANAGER"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD CONSTRAINT "PK_88afcb70ba4c733e2a9ab1831d4" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD "role_id" uuid`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_HOUSE_WORKER_TABLE_ASSIGNMENT"`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP CONSTRAINT "PK_HOUSE_WORKER"`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD CONSTRAINT "PK_251059d026bfae44fe2bf74d5f3" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD "manager_id" uuid`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_BOOKING_TABLE_ASSIGNMENT"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "PK_ASSIGNMENT"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "house_worker_id"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "house_worker_id" uuid`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "PK_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TYPE "public"."BOOKING_STATUS_ENUM" RENAME TO "BOOKING_STATUS_ENUM_old"`);
        await queryRunner.query(`CREATE TYPE "public"."BOOKING_STATUS_ENUM" AS ENUM('PENDING', 'CONFIRMED', 'MODIFIED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_KLEENIX', 'NO_SHOW', 'COMPLETED', 'DELAYED')`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" TYPE "public"."BOOKING_STATUS_ENUM" USING "status"::"text"::"public"."BOOKING_STATUS_ENUM"`);
        await queryRunner.query(`DROP TYPE "public"."BOOKING_STATUS_ENUM_old"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "package_id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "package_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "extra_service" DROP CONSTRAINT "PK_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "extra_service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "extra_service" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "extra_service" ADD CONSTRAINT "PK_8d741b4c689497daeae3414b60e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "PK_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "PK_bdac1dadeff9a00344ddc8e39d3" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD "booking_id" uuid`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP COLUMN "extra_service_id"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD "extra_service_id" uuid`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_SERVICE_TABLE_PACKAGE" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD CONSTRAINT "FK_ROLE_TABLE_ADMIN_MANAGER" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD CONSTRAINT "FK_MANAGER_TABLE_HOUSE_WORKER" FOREIGN KEY ("manager_id") REFERENCES "admin_manager"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_HOUSE_WORKER_TABLE_ASSIGNMENT" FOREIGN KEY ("house_worker_id") REFERENCES "house_worker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_BOOKING_TABLE_ASSIGNMENT" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_ADDRESS_TABLE_BOOKING" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_PACKAGE_TABLE_BOOKING" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE" FOREIGN KEY ("extra_service_id") REFERENCES "extra_service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_PACKAGE_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_ADDRESS_TABLE_BOOKING"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_BOOKING_TABLE_ASSIGNMENT"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_HOUSE_WORKER_TABLE_ASSIGNMENT"`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP CONSTRAINT "FK_MANAGER_TABLE_HOUSE_WORKER"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP CONSTRAINT "FK_ROLE_TABLE_ADMIN_MANAGER"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_SERVICE_TABLE_PACKAGE"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP COLUMN "extra_service_id"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD "extra_service_id" integer`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD "booking_id" integer`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP CONSTRAINT "PK_bdac1dadeff9a00344ddc8e39d3"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "PK_BOOKING_EXTRA_SERVICE" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "extra_service" DROP CONSTRAINT "PK_8d741b4c689497daeae3414b60e"`);
        await queryRunner.query(`ALTER TABLE "extra_service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "extra_service" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "extra_service" ADD CONSTRAINT "PK_EXTRA_SERVICE" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "FK_EXTRA_SERVICE_TABLE_BOOKING_EXTRA_SERVICE" FOREIGN KEY ("extra_service_id") REFERENCES "extra_service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "package_id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "package_id" integer`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "address_id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "address_id" integer`);
        await queryRunner.query(`CREATE TYPE "public"."BOOKING_STATUS_ENUM_old" AS ENUM('PENDING', 'CONFIRMED', 'MODIFIED', 'CANCELLED BY USER', 'CANCELLED BY KLEENIX', 'NO SHOW', 'COMPLETED', 'DELAYED')`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "status" TYPE "public"."BOOKING_STATUS_ENUM_old" USING "status"::"text"::"public"."BOOKING_STATUS_ENUM_old"`);
        await queryRunner.query(`DROP TYPE "public"."BOOKING_STATUS_ENUM"`);
        await queryRunner.query(`ALTER TYPE "public"."BOOKING_STATUS_ENUM_old" RENAME TO "BOOKING_STATUS_ENUM"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "PK_49171efc69702ed84c812f33540"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "PK_BOOKING" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking_extra_service" ADD CONSTRAINT "FK_BOOKING_TABLE_BOOKING_EXTRA_SERVICE" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "booking_id"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "booking_id" integer`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "house_worker_id"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "house_worker_id" integer`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "PK_ASSIGNMENT" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_BOOKING_TABLE_ASSIGNMENT" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP COLUMN "manager_id"`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD "manager_id" integer`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP CONSTRAINT "PK_251059d026bfae44fe2bf74d5f3"`);
        await queryRunner.query(`ALTER TABLE "house_worker" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD CONSTRAINT "PK_HOUSE_WORKER" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_HOUSE_WORKER_TABLE_ASSIGNMENT" FOREIGN KEY ("house_worker_id") REFERENCES "house_worker"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD "role_id" integer`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP CONSTRAINT "PK_88afcb70ba4c733e2a9ab1831d4"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD CONSTRAINT "PK_ADMIN_MANAGER" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "house_worker" ADD CONSTRAINT "FK_MANAGER_TABLE_HOUSE_WORKER" FOREIGN KEY ("manager_id") REFERENCES "admin_manager"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "role" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "PK_ROLE" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "admin_manager" ADD CONSTRAINT "FK_ROLE_TABLE_ADMIN_MANAGER" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "service_id"`);
        await queryRunner.query(`ALTER TABLE "package" ADD "service_id" integer`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "PK_308364c66df656295bc4ec467c2"`);
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "package" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "PK_PACKAGE" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_PACKAGE_TABLE_BOOKING" FOREIGN KEY ("package_id") REFERENCES "package"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`);
        await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "service" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "PK_SERVICE" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_SERVICE_TABLE_PACKAGE" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5"`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "PK_ADDRESS" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_ADDRESS_TABLE_BOOKING" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "address" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "customer" RENAME TO "user"`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_USER_TABLE_ADDRESS" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
