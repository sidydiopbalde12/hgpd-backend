import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsPaidToProviders1737900100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'providers',
      new TableColumn({
        name: 'is_paid',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('providers', 'is_paid');
  }
}
