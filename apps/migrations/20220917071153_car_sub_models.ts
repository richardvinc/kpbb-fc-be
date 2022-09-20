import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("car_sub_models", (table) => {
    table.uuid("id").primary();

    table.uuid("car_brand_id").references("id").inTable("car_brands");
    table.uuid("car_model_id").references("id").inTable("car_models");
    table.string("name").notNullable();
    table.string("printed_name").nullable();
    table.string("fuel_type").notNullable();

    table.string("transmission_type", 5).nullable();
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
  return knex.schema.dropTable("car_sub_models");
}
