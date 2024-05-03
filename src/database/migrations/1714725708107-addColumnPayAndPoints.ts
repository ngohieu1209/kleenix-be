import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnPayAndPoints1714725708107 implements MigrationInterface {
    name = 'AddColumnPayAndPoints1714725708107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "k_pay" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "k_points" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "used_pay" numeric(10,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "PK_USER"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_USER_TABLE_ADDRESS" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_USER_TABLE_ADDRESS"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "customer" ADD "id" integer NOT NULL DEFAULT nextval('user_id_seq')`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "PK_USER" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "used_pay"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "k_points"`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "k_pay"`);
    }

}
