import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_fuel_consumption_history", (table) => {
    table.uuid("id").primary();

    table.uuid("user_id").references("id").inTable("users");
    table.uuid("user_car_id").references("id").inTable("user_car");

    table.integer("km_traveled").defaultTo(0).comment("Km traveled in km");
    table.integer("fuel_filled").defaultTo(0).comment("Fuel filled in liters");
    table
      .integer("average")
      .defaultTo(0)
      .comment("Average fuel consumption in km/l");
    table.timestamp("filled_at").defaultTo(knex.fn.now());

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_fuel_consumption_history");
}
