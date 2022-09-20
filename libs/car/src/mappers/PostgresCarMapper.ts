import {
  Dimension,
  Mapper,
  StaticImplements,
  UniqueEntityId,
} from "@KPBBFC/core";

import {
  Car,
  CarBrand,
  CarDimension,
  CarModel,
  CarSubModel,
  FuelType,
  TankCapacity,
  TransmissionType,
} from "../domains";

export interface PostgresCarProps {
  id: string;
  brand: string;
  model: string;
  sub_model: string;
  fuel_type: string;

  transmission_type?: string;
  tank_capacity?: number;
  dimension_l?: number;
  dimension_w?: number;
  dimension_h?: number;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<Car, PostgresCarProps>>()
export class PostgresCarMapper {
  public static toDomain(props: PostgresCarProps): Car {
    return Car.create(
      {
        brand: CarBrand.create(props.brand),
        model: CarModel.create(props.model),
        subModel: CarSubModel.create(props.sub_model),
        fuelType: FuelType.create(props.fuel_type),

        tankCapacity: props.tank_capacity
          ? TankCapacity.create(props.tank_capacity)
          : undefined,
        transmissionType: props.transmission_type
          ? TransmissionType.create(props.transmission_type)
          : undefined,
        dimension: CarDimension.create({
          height: Dimension.create(props.dimension_h ?? 0),
          width: Dimension.create(props.dimension_w ?? 0),
          length: Dimension.create(props.dimension_l ?? 0),
        }),

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(domain: Car): PostgresCarProps {
    return {
      id: domain.id.toString(),

      brand: domain.brand.value,
      model: domain.model.value,
      sub_model: domain.subModel.value,
      fuel_type: domain.fuelType.value,

      tank_capacity: domain.tankCapacity?.value,
      transmission_type: domain.transmissionType?.value,
      dimension_l: domain.dimension?.length.value,
      dimension_w: domain.dimension?.width.value,
      dimension_h: domain.dimension?.height.value,

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
