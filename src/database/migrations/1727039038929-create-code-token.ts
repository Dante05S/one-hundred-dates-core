import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCodeToken1727039038929 implements MigrationInterface {
    name = 'CreateCodeToken1727039038929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "code_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL DEFAULT '', "expire_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "REL_ba5d95452bdcbe5e3f9396dff6" UNIQUE ("user_id"), CONSTRAINT "PK_0222cf9b6cac00e55aba1249edc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "code_token" ADD CONSTRAINT "FK_ba5d95452bdcbe5e3f9396dff63" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_token" DROP CONSTRAINT "FK_ba5d95452bdcbe5e3f9396dff63"`);
        await queryRunner.query(`DROP TABLE "code_token"`);
    }

}
