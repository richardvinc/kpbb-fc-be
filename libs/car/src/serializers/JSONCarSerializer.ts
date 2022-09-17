import { Serializer, StaticImplements } from "@KPBBFC/core";

import { Car } from "../domains";

export interface JSONCarProps {
  id: string;

  printedName: string;
  brand: string;
  model: string;
  fuelType: string;

  transmissionType?: string;
  tankCapacity?: number;
  dimension: {
    length: number;
    width: number;
    height: number;
  };

  createdAt?: string;
  updatedAt?: string;
}

@StaticImplements<Serializer<Car, JSONCarProps>>()
export class JSONCarSerializer {
  public static deserialize(): Car {
    throw new Error("Method not implemented.");
  }

  public static serialize(domain: Car): JSONCarProps {
    return {
      id: domain.id.toString(),

      printedName: domain.printedName,
      brand: domain.brand.value,
      model: domain.model.value,
      fuelType: domain.fuelType.value,

      transmissionType: domain.transmissionType?.value,
      tankCapacity: domain.tankCapacity?.value,
      dimension: {
        length: domain.dimension?.length.value ?? 0,
        width: domain.dimension?.width.value ?? 0,
        height: domain.dimension?.height.value ?? 0,
      },

      createdAt: domain.createdAt?.toISOString(),
      updatedAt: domain.updatedAt?.toISOString(),
    };
  }
}
