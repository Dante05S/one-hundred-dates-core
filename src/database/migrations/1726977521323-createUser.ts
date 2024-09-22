import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1726977521323 implements MigrationInterface {
    name = 'CreateUser1726977521323'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_type_couple_enum" AS ENUM('a', 'b')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL DEFAULT '', "type_couple" "public"."user_type_couple_enum", CONSTRAINT "UQ_52b61cb2bc64db2e4873b4a5c02" UNIQUE ("email", "name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_type_couple_enum"`);
    }

}
