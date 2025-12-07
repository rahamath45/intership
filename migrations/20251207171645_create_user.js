// migrations/202512_create_users_table.js
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.integer('age').nullable();
    table.date('dob').nullable();
    table.string('contact', 20).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable().defaultTo(null);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
