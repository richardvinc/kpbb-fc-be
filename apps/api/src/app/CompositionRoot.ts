import { asClass, asFunction } from "awilix";
import {
  app,
  apps,
  auth,
  credential,
  initializeApp,
  messaging,
} from "firebase-admin";
import Knex from "knex";

import {
  FirebaseTokenProvider,
  ITokenProvider,
  VerifyAuthTokenUseCase,
} from "@KPBBFC/auth";
import {
  CarService,
  ICarBrandRepository,
  ICarModelRepository,
  ICarService,
  ICarSubModelRepository,
  KnexCarBrandRepository,
  KnexCarModelRepository,
  KnexCarSubModelRepository,
  RetrieveCarListUseCase,
} from "@KPBBFC/car";
import {
  ConfigSourceOptions,
  DefaultCradle,
  getCurrentHub,
  initHub,
} from "@KPBBFC/core/hub";
import {
  AccumulatedFuelConsumptionService,
  IAccumulatedFuelConsumptionRepository,
  IAccumulatedFuelConsumptionService,
  KnexAccumulatedFuelConsumptionRepository,
  RetrieveAccumulatedFuelConsumptionByCarUseCase,
  RetrieveAccumulatedFuelConsumptionListUseCase,
  RetrieveTop10AccumulatedFuelConsumptionListUseCase,
} from "@KPBBFC/fuelConsumption";
import { BaseApplicationService } from "@KPBBFC/types";
import {
  CreateUserCarUseCase,
  CreateUserFuelConsumptionUseCase,
  CreateUserUseCase,
  IUserCarRepository,
  IUserCarService,
  IUserFuelConsumptionRepository,
  IUserFuelConsumptionService,
  IUserFuelConsumptionSummaryRepository,
  IUserFuelConsumptionSummaryService,
  IUserRepository,
  IUserService,
  KnexUserCarRepository,
  KnexUserFuelConsumptionRepository,
  KnexUserFuelConsumptionSummaryRepository,
  KnexUserRepository,
  RetrieveUserCarListUseCase,
  RetrieveUserFuelConsumptionListByCarUseCase,
  RetrieveUserFuelConsumptionSummaryListUseCase,
  RetrieveUserListUseCase,
  RetrieveUserUseCase,
  UserCarService,
  UserFuelConsumptionService,
  UserFuelConsumptionSummaryService,
  UserService,
} from "@KPBBFC/user";

export interface AppCradle extends DefaultCradle {
  firebaseAuthClient: auth.Auth;
  firebaseMessaging: messaging.Messaging;
  knexClient: Knex;
  imagesDomainName: string;

  // providers
  firebaseTokenProvider: ITokenProvider;

  // repositories
  userRepository: IUserRepository;
  userCarRepository: IUserCarRepository;
  userFuelConsumptionRepository: IUserFuelConsumptionRepository;
  userFuelConsumptionSummaryRepository: IUserFuelConsumptionSummaryRepository;
  carBrandRepository: ICarBrandRepository;
  carModelRepository: ICarModelRepository;
  carSubModelRepository: ICarSubModelRepository;
  accumulatedFuelConsumptionRepository: IAccumulatedFuelConsumptionRepository;

  // services
  userService: IUserService;
  userCarService: IUserCarService;
  userFuelConsumptionService: IUserFuelConsumptionService;
  userFuelConsumptionSummaryService: IUserFuelConsumptionSummaryService;
  carService: ICarService;
  accumulatedFuelConsumptionService: IAccumulatedFuelConsumptionService;
}

export interface ApplicationService extends BaseApplicationService {
  // auth
  verifyAuthToken: VerifyAuthTokenUseCase;

  // user
  createUser: CreateUserUseCase;
  retrieveUser: RetrieveUserUseCase;
  retrieveUserList: RetrieveUserListUseCase;

  // user-car
  createUserCar: CreateUserCarUseCase;
  retrieveUserCarList: RetrieveUserCarListUseCase;

  // user fuel consumption
  createUserFuelConsumption: CreateUserFuelConsumptionUseCase;
  retrieveUserFuelConsumptionListByCar: RetrieveUserFuelConsumptionListByCarUseCase;
  retrieveUserFuelConsumptionSummaryList: RetrieveUserFuelConsumptionSummaryListUseCase;

  // car
  retrieveCarList: RetrieveCarListUseCase;
  retrieveAccumulatedFuelConsumptionList: RetrieveAccumulatedFuelConsumptionListUseCase;
  retrieveTop10AccumulatedFuelConsumptionList: RetrieveTop10AccumulatedFuelConsumptionListUseCase;
  retrieveAccumulatedFuelConsumptionByCar: RetrieveAccumulatedFuelConsumptionByCarUseCase;
}

export async function composeApplication(): Promise<void> {
  await initHub<AppCradle, ApplicationService>({
    configSource: getConfigSource(),
    cradle: {
      firebaseAuthClient: useFirebaseAuth(),
      firebaseMessaging: useFirebaseMessaging,
      knexClient: useKnex(),
      imagesDomainName: asFunction(() => {
        return process.env.IMAGES_DOMAIN_NAME || "";
      }),

      // providers
      firebaseTokenProvider: asClass(FirebaseTokenProvider).singleton(),

      // repositories
      userRepository: asClass(KnexUserRepository).singleton(),
      userCarRepository: asClass(KnexUserCarRepository).singleton(),
      userFuelConsumptionRepository: asClass(
        KnexUserFuelConsumptionRepository
      ).singleton(),
      userFuelConsumptionSummaryRepository: asClass(
        KnexUserFuelConsumptionSummaryRepository
      ).singleton(),
      carBrandRepository: asClass(KnexCarBrandRepository).singleton(),
      carModelRepository: asClass(KnexCarModelRepository).singleton(),
      carSubModelRepository: asClass(KnexCarSubModelRepository).singleton(),
      accumulatedFuelConsumptionRepository: asClass(
        KnexAccumulatedFuelConsumptionRepository
      ).singleton(),

      // services
      userService: asClass(UserService).singleton(),
      userCarService: asClass(UserCarService).singleton(),
      userFuelConsumptionService: asClass(
        UserFuelConsumptionService
      ).singleton(),
      userFuelConsumptionSummaryService: asClass(
        UserFuelConsumptionSummaryService
      ).singleton(),
      carService: asClass(CarService).singleton(),
      accumulatedFuelConsumptionService: asClass(
        AccumulatedFuelConsumptionService
      ).singleton(),
    },
    useCases: {
      // auth
      verifyAuthToken: asClass(VerifyAuthTokenUseCase).singleton(),

      // user
      createUser: asClass(CreateUserUseCase).singleton(),
      retrieveUser: asClass(RetrieveUserUseCase).singleton(),
      retrieveUserList: asClass(RetrieveUserListUseCase).singleton(),

      // user-car
      createUserCar: asClass(CreateUserCarUseCase).singleton(),
      retrieveUserCarList: asClass(RetrieveUserCarListUseCase).singleton(),
      retrieveUserFuelConsumptionListByCar: asClass(
        RetrieveUserFuelConsumptionListByCarUseCase
      ).singleton(),
      retrieveUserFuelConsumptionSummaryList: asClass(
        RetrieveUserFuelConsumptionSummaryListUseCase
      ).singleton(),

      // user-fuel-consumption
      createUserFuelConsumption: asClass(
        CreateUserFuelConsumptionUseCase
      ).singleton(),

      // car
      retrieveCarList: asClass(RetrieveCarListUseCase).singleton(),
      retrieveAccumulatedFuelConsumptionList: asClass(
        RetrieveAccumulatedFuelConsumptionListUseCase
      ).singleton(),
      retrieveTop10AccumulatedFuelConsumptionList: asClass(
        RetrieveTop10AccumulatedFuelConsumptionListUseCase
      ).singleton(),
      retrieveAccumulatedFuelConsumptionByCar: asClass(
        RetrieveAccumulatedFuelConsumptionByCarUseCase
      ).singleton(),
    },
  });
}

export async function dispose(): Promise<void> {
  await getCurrentHub().dispose();
}

function useKnex() {
  return asFunction(() => {
    const config: Knex.Config = {
      client: "pg",
      connection: {
        connectionString: process.env.PG_DATABASE_URL,
        connectionTimeoutMillis: 3000,
        requestTimeout: 3000,
      },
    };

    return Knex(config);
  })
    .singleton()
    .disposer(async (knex) => {
      await knex.destroy();
    });
}

function useFirebaseAuth() {
  return asFunction(() => {
    const creds = process.env.FIREBASE_CREDENTIALS;
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    console.log(creds);

    if (apps.length === 0) {
      return initializeApp({
        credential: credential.cert(creds ? JSON.parse(creds) : path),
      }).auth();
    } else {
      return app().auth();
    }
  })
    .singleton()
    .disposer(async (auth) => {
      await auth.app.delete();
    });
}

const useFirebaseMessaging = asFunction(() => {
  let app = apps[0];
  if (!app) {
    const creds = process.env.FIREBASE_CREDENTIALS;
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    app = initializeApp({
      credential: credential.cert(creds ? JSON.parse(creds) : path),
    });
  }

  return app.messaging();
})
  .disposer(async (messaging) => {
    await messaging.app.delete();
  })
  .singleton();

function getConfigSource(): ConfigSourceOptions {
  return {
    provider: "dotenv",
  };
}
