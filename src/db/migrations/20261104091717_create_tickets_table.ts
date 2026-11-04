import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tickets', (table) => {
    table.increments('id').primary();
    table.string('title', 200).notNullable();
    table.text('description').nullable();

    table
      .enu('priority', ['low', 'medium', 'high'], {
        useNative: false,
        enumName: 'tickets_priority',
      })
      .notNullable()
      .defaultTo('medium');
    table
      .enu('status', ['open', 'in_progress', 'resolved'], {
        useNative: false,
        enumName: 'tickets_status',
      })
      .notNullable()
      .defaultTo('open');

    table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tickets');
}