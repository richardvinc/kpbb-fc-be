import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("cars", (table) => {
    table.uuid("id").primary();

    table.string("brand").notNullable();
    table.string("model").notNullable();
    table.string("fuel_type").notNullable();

    table.string("transmission_type", 2).nullable();
    table.integer("tank_capacity").defaultTo(0);
    table.integer("dimension_l").defaultTo(0);
    table.integer("dimension_w").defaultTo(0);
    table.integer("dimension_h").defaultTo(0);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("cars");
}
