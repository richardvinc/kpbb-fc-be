/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JSONCarSubModelProps, JSONCarSubModelSerializer } from "@KPBBFC/car";
import { Serializer, StaticImplements } from "@KPBBFC/core";

import { UserCar } from "../domains";

export interface JSONUserCarProps extends JSONCarSubModelProps {
  id: string;
  plateNumber: string;
}

@StaticImplements<Serializer<UserCar, JSONUserCarProps>>()
export class JSONUserCarSerializer {
  public static deserialize(): UserCar {
    throw new Error("Method not implemented.");
  }

  public static serialize(domain: UserCar): JSONUserCarProps {
    if (!domain.car) throw `user car is required`;

    return {
      id: domain.id.toString(),
      plateNumber: domain.plateNumber.value,

      ...JSONCarSubModelSerializer.serialize(domain.car),

      createdAt: domain.createdAt?.toISOString(),
      updatedAt: domain.updatedAt?.toISOString(),
    };
  }
}
