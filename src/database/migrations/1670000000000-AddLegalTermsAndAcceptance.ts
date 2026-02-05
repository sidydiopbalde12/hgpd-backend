import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddLegalTermsAndAcceptance1670000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer la table legal_terms
    await queryRunner.createTable(
      new Table({
        name: 'legal_terms',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['CGU', 'CGV'],
          },
          {
            name: 'version',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Créer la table terms_acceptance
    await queryRunner.createTable(
      new Table({
        name: 'terms_acceptance',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'legal_terms_id',
            type: 'uuid',
          },
          {
            name: 'ip',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'channel',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'accepted_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['legal_terms_id'],
            referencedTableName: 'legal_terms',
            referencedColumnNames: ['id'],
          },
        ],
      }),
      true,
    );

    // Ajouter les colonnes CGU à la table users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'cgu_accepted_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'cgu_accepted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'cgu_accepted_ip',
        type: 'varchar',
        length: '45',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'cgu_accepted_channel',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    );

    // Ajouter les colonnes CGV à la table payments
    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'cgv_accepted_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'cgv_accepted_version',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'amount_ht',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'amount_tva',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'payments',
      new TableColumn({
        name: 'amount_ttc',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les colonnes de payments
    await queryRunner.dropColumn('payments', 'cgv_accepted_id');
    await queryRunner.dropColumn('payments', 'cgv_accepted_version');
    await queryRunner.dropColumn('payments', 'amount_ht');
    await queryRunner.dropColumn('payments', 'amount_tva');
    await queryRunner.dropColumn('payments', 'amount_ttc');

    // Supprimer les colonnes de users
    await queryRunner.dropColumn('users', 'cgu_accepted_id');
    await queryRunner.dropColumn('users', 'cgu_accepted_at');
    await queryRunner.dropColumn('users', 'cgu_accepted_ip');
    await queryRunner.dropColumn('users', 'cgu_accepted_channel');

    // Supprimer les tables
    await queryRunner.dropTable('terms_acceptance');
    await queryRunner.dropTable('legal_terms');
  }
}
