export type HttpSuccessResponse<T> = {
  $metadata: HttpResponseMetadata;
  version?: string;
  ok: true;
} & T;

export interface HttpErrorResponse {
  $metadata: HttpResponseMetadata;
  ok: false;
  error: {
    code: string;
    message?: string;
  };
}

export interface HttpResponseMetadata {
  request_id: string;
}

export type HttpResponse<T> = HttpSuccessResponse<T> | HttpErrorResponse;
