import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_car", (table) => {
    table.uuid("id").primary();

    table.uuid("user_id").references("id").inTable("users");
    table.uuid("car_brand_id").references("id").inTable("car_brands");
    table.uuid("car_model_id").references("id").inTable("car_models");
    table.uuid("car_sub_model_id").references("id").inTable("car_sub_models");

    table.string("plate_number").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_car");
}
