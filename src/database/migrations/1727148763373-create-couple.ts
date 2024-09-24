import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCouple1727148763373 implements MigrationInterface {
    name = 'CreateCouple1727148763373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "couple" ("id" SERIAL NOT NULL, "init_date" TIMESTAMP, "user_a_id" uuid NOT NULL, "user_b_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_bfe00c34b532529a162e09ee6f" UNIQUE ("user_a_id"), CONSTRAINT "REL_d98d17104f0b90058367dbf6a3" UNIQUE ("user_b_id"), CONSTRAINT "PK_b7742895ce8107b8fff5350ba19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "couple" ADD CONSTRAINT "FK_bfe00c34b532529a162e09ee6f8" FOREIGN KEY ("user_a_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "couple" ADD CONSTRAINT "FK_d98d17104f0b90058367dbf6a36" FOREIGN KEY ("user_b_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "couple" DROP CONSTRAINT "FK_d98d17104f0b90058367dbf6a36"`);
        await queryRunner.query(`ALTER TABLE "couple" DROP CONSTRAINT "FK_bfe00c34b532529a162e09ee6f8"`);
        await queryRunner.query(`DROP TABLE "couple"`);
    }

}
