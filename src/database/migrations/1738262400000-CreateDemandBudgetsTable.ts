import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDemandBudgetsTable1738262400000 implements MigrationInterface {
  name = 'CreateDemandBudgetsTable1738262400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "demand_budgets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "demand_id" uuid NOT NULL,
        "category_id" integer NOT NULL,
        "amount" decimal(12,2) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_demand_budgets" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_demand_budgets_demand_category" UNIQUE ("demand_id", "category_id"),
        CONSTRAINT "FK_demand_budgets_demand" FOREIGN KEY ("demand_id") REFERENCES "demands"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_demand_budgets_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_demand_budgets_demand_id" ON "demand_budgets" ("demand_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_demand_budgets_demand_id"`);
    await queryRunner.query(`DROP TABLE "demand_budgets"`);
  }
}
