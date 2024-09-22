import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnRefreshTokenUser1726986368248 implements MigrationInterface {
    name = 'AddColumnRefreshTokenUser1726986368248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refresh_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_token"`);
    }

}
