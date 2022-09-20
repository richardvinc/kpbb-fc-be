import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("accumulated_fuel_consumption", (table) => {
    table.uuid("car_brand_id").references("id").inTable("car_brands");
    table.uuid("car_model_id").references("id").inTable("car_models");
    table.uuid("car_sub_model_id").references("id").inTable("car_sub_models");

    table.primary(["car_sub_model_id"]);

    table.integer("total_car").defaultTo(0);
    table
      .integer("total_fuel_filled")
      .defaultTo(0)
      .comment("Total fuel filled in liters");
    table
      .integer("total_km_travelled")
      .defaultTo(0)
      .comment("Total km travelled in km");
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
  return knex.schema.dropTable("accumulated_fuel_consumption");
}
