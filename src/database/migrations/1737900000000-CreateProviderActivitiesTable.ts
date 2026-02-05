import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProviderActivitiesTable1737900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'provider_activities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'providerId',
            type: 'uuid',
          },
          {
            name: 'activityType',
            type: 'enum',
            enum: [
              'PROFILE_UPDATE',
              'CATEGORY_ADD',
              'CATEGORY_REMOVE',
              'PHOTO_UPLOAD',
              'PHOTO_DELETE',
              'VIDEO_UPLOAD',
              'VIDEO_DELETE',
              'DEMAND_ACCEPTED',
              'DEMAND_REJECTED',
              'PAYMENT_COMPLETED',
              'PAYMENT_FAILED',
              'STATUS_CHANGE',
            ],
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['providerId'],
            referencedTableName: 'providers',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'provider_activities',
      new TableIndex({
        columnNames: ['providerId', 'createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'provider_activities',
      new TableIndex({
        columnNames: ['providerId', 'activityType'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('provider_activities');
  }
}
