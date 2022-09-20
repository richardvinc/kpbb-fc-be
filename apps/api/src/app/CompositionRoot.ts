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
  ICarRepository,
  ICarService,
  KnexCarRepository,
} from "@KPBBFC/car";
import {
  ConfigSourceOptions,
  DefaultCradle,
  getCurrentHub,
  initHub,
} from "@KPBBFC/core/hub";
import { BaseApplicationService } from "@KPBBFC/types";
import {
  CreateUserUseCase,
  IUserRepository,
  IUSerService,
  KnexUserRepository,
  RetrieveUserListUseCase,
  RetrieveUserUseCase,
  UserSerive,
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
  carRepository: ICarRepository;

  // services
  userService: IUSerService;
  carService: ICarService;
}

export interface ApplicationService extends BaseApplicationService {
  // auth
  verifyAuthToken: VerifyAuthTokenUseCase;

  // user
  createUser: CreateUserUseCase;
  retrieveUser: RetrieveUserUseCase;
  retrieveUserList: RetrieveUserListUseCase;
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
      carRepository: asClass(KnexCarRepository).singleton(),

      // services
      userService: asClass(UserSerive).singleton(),
      carService: asClass(CarService).singleton(),
    },
    useCases: {
      // auth
      verifyAuthToken: asClass(VerifyAuthTokenUseCase).singleton(),

      // user
      createUser: asClass(CreateUserUseCase).singleton(),
      retrieveUser: asClass(RetrieveUserUseCase).singleton(),
      retrieveUserList: asClass(RetrieveUserListUseCase).singleton(),
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
