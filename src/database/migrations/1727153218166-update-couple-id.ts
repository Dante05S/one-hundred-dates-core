import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCoupleId1727153218166 implements MigrationInterface {
    name = 'UpdateCoupleId1727153218166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "couple" DROP CONSTRAINT "PK_b7742895ce8107b8fff5350ba19"`);
        await queryRunner.query(`ALTER TABLE "couple" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "couple" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "couple" ADD CONSTRAINT "PK_b7742895ce8107b8fff5350ba19" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "couple" DROP CONSTRAINT "PK_b7742895ce8107b8fff5350ba19"`);
        await queryRunner.query(`ALTER TABLE "couple" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "couple" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "couple" ADD CONSTRAINT "PK_b7742895ce8107b8fff5350ba19" PRIMARY KEY ("id")`);
    }

}
