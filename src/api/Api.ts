/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface MigrationMethodDetail {
  /** ID */
  id?: number;
  /**
   * Название
   * @minLength 1
   * @maxLength 255
   */
  title: string;
  /**
   * URL изображения
   * @format uri
   * @maxLength 200
   */
  image_url?: string | null;
  /** Коэффициент */
  factor?: number;
  /**
   * Применение 1
   * @maxLength 255
   */
  usage1?: string | null;
  /**
   * Применение 2
   * @maxLength 255
   */
  usage2?: string | null;
  /**
   * Применение 3
   * @maxLength 255
   */
  usage3?: string | null;
  /**
   * Преимущество 1
   * @maxLength 255
   */
  advantage1?: string | null;
  /**
   * Преимущество 2
   * @maxLength 255
   */
  advantage2?: string | null;
  /**
   * Преимущество 3
   * @maxLength 255
   */
  advantage3?: string | null;
  /** Описание */
  description?: string | null;
}

export interface MigrationRequestCreate {
  /**
   * Объем данных
   * @format decimal
   */
  amount_data?: string | null;
}

export interface MigrationRequestAction {
  /**
   * Action
   * Действие: 'complete' для завершения, 'reject' для отклонения
   */
  action: "complete" | "reject";
}

export interface MigrationMethodInRequestCreate {
  /**
   * Пропускная способность
   * @format decimal
   */
  bandwidth?: string | null;
}

export interface UserLogin {
  /**
   * Username
   * @minLength 1
   */
  username: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface User {
  /** ID */
  id?: number;
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username?: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string | null;
  /**
   * First name
   * @maxLength 150
   */
  first_name?: string | null;
  /**
   * Last name
   * @maxLength 150
   */
  last_name?: string | null;
}

export interface UserRegistration {
  /**
   * Username
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   * @minLength 1
   * @maxLength 150
   * @pattern ^[\w.@+-]+$
   */
  username: string;
  /**
   * Email address
   * @format email
   * @maxLength 254
   */
  email?: string | null;
  /**
   * First name
   * @maxLength 150
   */
  first_name?: string | null;
  /**
   * Last name
   * @maxLength 150
   */
  last_name?: string | null;
  /**
   * Password
   * @minLength 8
   */
  password: string;
  /**
   * Password confirm
   * @minLength 1
   */
  password_confirm: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8000/api",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  migrationMethods = {
    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsList
     * @request GET:/migration-methods/
     * @secure
     */
    migrationMethodsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-methods/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsCreate
     * @request POST:/migration-methods/
     * @secure
     */
    migrationMethodsCreate: (
      data: MigrationMethodDetail,
      params: RequestParams = {},
    ) =>
      this.request<MigrationMethodDetail, any>({
        path: `/migration-methods/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsRead
     * @request GET:/migration-methods/{id}/
     * @secure
     */
    migrationMethodsRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-methods/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsUpdate
     * @request PUT:/migration-methods/{id}/
     * @secure
     */
    migrationMethodsUpdate: (
      id: string,
      data: MigrationMethodDetail,
      params: RequestParams = {},
    ) =>
      this.request<MigrationMethodDetail, any>({
        path: `/migration-methods/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsDelete
     * @request DELETE:/migration-methods/{id}/
     * @secure
     */
    migrationMethodsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-methods/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsDraftCreate
     * @request POST:/migration-methods/{id}/draft/
     * @secure
     */
    migrationMethodsDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-methods/${id}/draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-methods
     * @name MigrationMethodsImageCreate
     * @request POST:/migration-methods/{id}/image/
     * @secure
     */
    migrationMethodsImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-methods/${id}/image/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  migrationRequests = {
    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsList
     * @request GET:/migration-requests/
     * @secure
     */
    migrationRequestsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-requests/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsUserList
     * @request GET:/migration-requests/user/
     * @secure
     */
    migrationRequestsUserList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-requests/user/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsRead
     * @request GET:/migration-requests/{id}/
     * @secure
     */
    migrationRequestsRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-requests/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsUpdate
     * @request PUT:/migration-requests/{id}/
     * @secure
     */
    migrationRequestsUpdate: (
      id: string,
      data: MigrationRequestCreate,
      params: RequestParams = {},
    ) =>
      this.request<MigrationRequestCreate, any>({
        path: `/migration-requests/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsDelete
     * @request DELETE:/migration-requests/{id}/
     * @secure
     */
    migrationRequestsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-requests/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsCompleteUpdate
     * @request PUT:/migration-requests/{id}/complete/
     * @secure
     */
    migrationRequestsCompleteUpdate: (
      id: string,
      data: MigrationRequestAction,
      params: RequestParams = {},
    ) =>
      this.request<MigrationRequestAction, any>({
        path: `/migration-requests/${id}/complete/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsFormUpdate
     * @request PUT:/migration-requests/{id}/form/
     * @secure
     */
    migrationRequestsFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/migration-requests/${id}/form/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsMethodsUpdate
     * @request PUT:/migration-requests/{id}/methods/{method_pk}/
     * @secure
     */
    migrationRequestsMethodsUpdate: (
      id: string,
      methodPk: string,
      data: MigrationMethodInRequestCreate,
      params: RequestParams = {},
    ) =>
      this.request<MigrationMethodInRequestCreate, any>({
        path: `/migration-requests/${id}/methods/${methodPk}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags migration-requests
     * @name MigrationRequestsMethodsDelete
     * @request DELETE:/migration-requests/{id}/methods/{method_pk}/
     * @secure
     */
    migrationRequestsMethodsDelete: (
      id: string,
      methodPk: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/migration-requests/${id}/methods/${methodPk}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags user
     * @name UserLoginCreate
     * @request POST:/user/login/
     * @secure
     */
    userLoginCreate: (data: UserLogin, params: RequestParams = {}) =>
      this.request<UserLogin, any>({
        path: `/user/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserLogoutCreate
     * @request POST:/user/logout/
     * @secure
     */
    userLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserProfileList
     * @request GET:/user/profile/
     * @secure
     */
    userProfileList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user/profile/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserProfileUpdate
     * @request PUT:/user/profile/
     * @secure
     */
    userProfileUpdate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/user/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRegisterCreate
     * @request POST:/user/register/
     * @secure
     */
    userRegisterCreate: (data: UserRegistration, params: RequestParams = {}) =>
      this.request<UserRegistration, any>({
        path: `/user/register/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
