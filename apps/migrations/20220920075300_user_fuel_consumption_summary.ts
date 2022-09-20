import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_fuel_consumption_summary", (table) => {
    table.uuid("user_car_id").references("id").inTable("user_car").primary();

    table.uuid("user_id").references("id").inTable("users");
    table.uuid("car_brand_id").references("id").inTable("car_brands");
    table.uuid("car_model_id").references("id").inTable("car_models");
    table.uuid("car_sub_model_id").references("id").inTable("car_sub_models");

    table
      .integer("total_km_traveled")
      .defaultTo(0)
      .comment("Total km traveled in km");
    table
      .integer("total_fuel_filled")
      .defaultTo(0)
      .comment("Total fuel filled in liters");
    table
      .integer("average")
      .defaultTo(0)
      .comment("Average fuel consumption in km/l");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_fuel_consumption_summary");
}
