import * as crypto from "crypto";
import phin from "phin";

import { getCurrentHub, MobileNumber } from "@kopeka/core";
import { BaseProvider } from "@kopeka/core/providers";

import { OTPMethod, OTPMethodEnum } from "../domain";
import { OTP } from "../domain/OTP";

export type KokattoRequestOTPResponse = {
  status: number;
  message: string;
  data?: {
    requestId: string;
    code: number;
    dispatchStatus: string;
    validityStatus: string;
  };
};

export type KokattoVerifyOTPResponse = {
  status: number;
  message: string;
  data?: {
    requestId: string;
    code: number;
    dispatchStatus: string;
    validityStatus: string;
  };
};

export interface KokattoRequestOTPPayload {
  campaignName: string;
  clientId: string;
  codeLength?: number;
  codeValidity?: number;
  destination: string;
  timestamp: string;
  signature?: string;
}

export interface KokattoVerifyOTPPayload {
  campaignName: string;
  clientId: string;
  code: number;
  timestamp: string;
  signature?: string;
}

export class KokattoOTPProvider extends BaseProvider {
  constructor(
    protected baseUrl: string,
    protected clientIdMissedCall: string,
    protected campaignNameMissedCall: string,
    protected secretMissedCall: string,
    protected clientIdSMS: string,
    protected campaignNameSMS: string,
    protected secretSMS: string,
    protected clientIdWhatsapp: string,
    protected campaignNameWhatsapp: string,
    protected secretWhatsapp: string
  ) {
    super("KokattoOTPProvider");

    if (
      !baseUrl ||
      !clientIdMissedCall ||
      !campaignNameMissedCall ||
      !secretMissedCall ||
      !clientIdSMS ||
      !campaignNameSMS ||
      !secretSMS ||
      !clientIdWhatsapp ||
      !campaignNameWhatsapp ||
      !secretWhatsapp
    ) {
      throw new Error(
        "Kokatto's base url, client id, campaign id, and secret is required"
      );
    }
  }

  async requestOTP(
    destination: MobileNumber,
    method: OTPMethod
  ): Promise<KokattoRequestOTPResponse> {
    const logger = this.logger.child({
      methodName: "requestOTP",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { destination } });

    const timestamp = new Date().toISOString();
    const payload: KokattoRequestOTPPayload = {
      campaignName: this.getKokattoCampaignName(method),
      clientId: this.getKokattoClientId(method),
      timestamp,
      codeLength: 6, // default to 6 characters
      codeValidity: 60,
      destination: destination.value,
    };
    const signature = this.generateSignature(payload, method);
    payload.signature = signature;

    logger.debug(payload);

    const response = await phin<KokattoRequestOTPResponse>({
      url: `${this.baseUrl}/otp/request`,
      method: "POST",
      parse: "json",
      data: payload,
    });

    const { statusCode, body } = response;

    logger.debug({
      response: {
        statusCode,
        body,
      },
    });

    if (!statusCode?.toString().startsWith("2")) {
      logger.fatal({ body });
      throw Error(body.message);
    }

    logger.trace("END");
    return body;
  }

  async verifyOTP(
    code: OTP,
    requestId: string,
    method: OTPMethod
  ): Promise<KokattoVerifyOTPResponse> {
    const logger = this.logger.child({
      methodName: "verifyOTP",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { code, requestId } });

    const timestamp = new Date().toISOString();
    const payload: KokattoVerifyOTPPayload = {
      campaignName: this.getKokattoCampaignName(method),
      clientId: this.getKokattoClientId(method),
      timestamp,
      code: +code.value,
    };
    const signature = this.generateSignature(payload, method);
    payload.signature = signature;

    logger.debug(payload);

    const response = await phin<KokattoVerifyOTPResponse>({
      url: `${this.baseUrl}/otp/validation/${requestId}`,
      method: "PUT",
      parse: "json",
      data: payload,
    });

    const { statusCode, body } = response;

    logger.debug({
      response: {
        statusCode,
        body,
      },
    });

    if (statusCode !== 200) {
      logger.fatal({ body });
      throw Error(body.message);
    }

    logger.trace("END");

    return body;
  }

  // according to provider's specification
  generateSignature(
    payload: KokattoRequestOTPPayload | KokattoVerifyOTPPayload,
    method: OTPMethod
  ): string {
    const logger = this.logger.child({
      methodName: "generateSignature",
      traceId: getCurrentHub().getTraceId(),
    });

    logger.trace("BEGIN");
    logger.debug({ args: { payload } });

    const sortedObject = Object.fromEntries(
      Object.entries(payload).sort((a, b) => a[0].localeCompare(b[0]))
    );
    logger.debug({ sortedObject });

    const payloadAsQueryString = Object.keys(sortedObject)
      .map((key) => `${key}=${encodeURIComponent(sortedObject[key])}`)
      .join("&");

    const queryMd5 = crypto
      .createHash("md5")
      .update(payloadAsQueryString, "utf-8")
      .digest("hex");

    const queryHmacSha256 = crypto
      .createHmac("sha256", this.getKokattoSecret(method))
      .update(queryMd5, "utf-8")
      .digest("hex")
      .toUpperCase();

    logger.trace("END");
    return queryHmacSha256;
  }

  getKokattoSecret(method: OTPMethod): string {
    switch (method.value) {
      case OTPMethodEnum.CALL:
        return this.secretMissedCall;
      case OTPMethodEnum.SMS:
        return this.secretSMS;
      case OTPMethodEnum.WHATSAPP:
        return this.secretWhatsapp;
      default:
        return this.secretMissedCall;
    }
  }

  getKokattoCampaignName(method: OTPMethod): string {
    switch (method.value) {
      case OTPMethodEnum.CALL:
        return this.campaignNameMissedCall;
      case OTPMethodEnum.SMS:
        return this.campaignNameSMS;
      case OTPMethodEnum.WHATSAPP:
        return this.campaignNameWhatsapp;
      default:
        return this.campaignNameMissedCall;
    }
  }
  getKokattoClientId(method: OTPMethod): string {
    switch (method.value) {
      case OTPMethodEnum.CALL:
        return this.clientIdMissedCall;
      case OTPMethodEnum.SMS:
        return this.clientIdSMS;
      case OTPMethodEnum.WHATSAPP:
        return this.clientIdWhatsapp;
      default:
        return this.clientIdMissedCall;
    }
  }
}
