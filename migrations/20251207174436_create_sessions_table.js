exports.up = function (knex) {
  return knex.schema.createTable("sessions", function (table) {
    table.increments("id").primary();                // id INT AUTO_INCREMENT PRIMARY KEY
    table.string("token", 255).notNullable();        // token VARCHAR(255) NOT NULL
    table.integer("user_id").unsigned().notNullable(); // user_id INT NOT NULL
    table.timestamp("created_at").defaultTo(knex.fn.now()); // created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
