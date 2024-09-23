import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnTempCoupleCodeUser1727068557128 implements MigrationInterface {
    name = 'AddColumnTempCoupleCodeUser1727068557128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "temp_couple_code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "temp_couple_code"`);
    }

}
