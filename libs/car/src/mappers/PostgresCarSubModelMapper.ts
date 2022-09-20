import {
  Dimension,
  Mapper,
  StaticImplements,
  UniqueEntityId,
} from "@KPBBFC/core";

import {
  CarBrand,
  CarDimension,
  CarModel,
  CarSubModel,
  FuelType,
  TankCapacity,
  TransmissionType,
} from "../domains";

export interface PostgresCarSubModelProps {
  id: string;
  name: string;
  printed_name: string;

  car_brand_id: string;
  brand?: CarBrand;
  car_model_id: string;
  model?: CarModel;

  fuel_type: string;
  transmission_type?: string;
  tank_capacity?: number;
  dimension_l: number;
  dimension_w: number;
  dimension_h: number;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

@StaticImplements<Mapper<CarSubModel, PostgresCarSubModelProps>>()
export class PostgresCarSubModelMapper {
  public static toDomain(props: PostgresCarSubModelProps): CarSubModel {
    return CarSubModel.create(
      {
        name: props.name,
        printedName: props.printed_name,

        brandId: new UniqueEntityId(props.car_brand_id),
        brand: props.brand,

        modelId: new UniqueEntityId(props.car_model_id),
        model: props.model,

        fuelType: FuelType.create(props.fuel_type),
        transmissionType: props.transmission_type
          ? TransmissionType.create(props.transmission_type)
          : undefined,
        tankCapacity: props.tank_capacity
          ? TankCapacity.create(props.tank_capacity)
          : undefined,
        dimension: CarDimension.create({
          height: Dimension.create(props.dimension_h),
          width: Dimension.create(props.dimension_w),
          length: Dimension.create(props.dimension_l),
        }),

        createdAt: props.created_at,
        updatedAt: props.updated_at,
        deletedAt: props.deleted_at,
      },
      new UniqueEntityId(props.id)
    );
  }

  public static toPersistence(domain: CarSubModel): PostgresCarSubModelProps {
    return {
      id: domain.id.toString(),

      name: domain.name,
      printed_name: domain.printedName,
      car_brand_id: domain.brandId.toString(),
      car_model_id: domain.modelId.toString(),
      fuel_type: domain.fuelType.value,
      transmission_type: domain.transmissionType?.value,
      tank_capacity: domain.tankCapacity?.value,

      dimension_l: domain.dimension ? domain.dimension.length.value : 0,
      dimension_w: domain.dimension ? domain.dimension.width.value : 0,
      dimension_h: domain.dimension ? domain.dimension.height.value : 0,

      created_at: domain.createdAt ?? new Date(),
      updated_at: domain.updatedAt ?? new Date(),
      deleted_at: domain.deletedAt,
    };
  }
}
