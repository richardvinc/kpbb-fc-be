import { Serializer, StaticImplements } from "@KPBBFC/core";

import { CarSubModel } from "../domains";

export interface JSONCarSubModelProps {
  id: string;

  name: string;
  printedName: string;

  brand: {
    id: string;
    name?: string;
  };
  model: {
    id: string;
    name?: string;
  };

  fuelType: string;
  transmissionType: string;
  tankCapacity?: number;
  dimension: {
    length: number;
    width: number;
    height: number;
  };

  createdAt?: string;
  updatedAt?: string;
}

@StaticImplements<Serializer<CarSubModel, JSONCarSubModelProps>>()
export class JSONCarSubModelSerializer {
  public static deserialize(): CarSubModel {
    throw new Error("Method not implemented.");
  }

  public static serialize(domain: CarSubModel): JSONCarSubModelProps {
    return {
      id: domain.id.toString(),

      name: domain.name,
      printedName: domain.printedName,

      brand: {
        id: domain.brandId.toString(),
        name: domain.brand?.name,
      },
      model: {
        id: domain.modelId.toString(),
        name: domain.model?.name,
      },
      fuelType: domain.fuelType.value,
      transmissionType: domain.transmissionType.value,
      tankCapacity: domain.tankCapacity?.value,

      dimension: {
        length: domain.dimension ? domain.dimension.length.value : 0,
        width: domain.dimension ? domain.dimension.width.value : 0,
        height: domain.dimension ? domain.dimension.height.value : 0,
      },

      createdAt: domain.createdAt?.toISOString(),
      updatedAt: domain.updatedAt?.toISOString(),
    };
  }
}
