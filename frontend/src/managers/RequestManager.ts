import { IDictionary } from 'common/types';

export interface IRequest {
  id: string;
  ref: XMLHttpRequest;
}

export interface IRequestParameters {
  headers: IDictionary<string>;
  body?: any;
}

export type GetParameters = Pick<IRequestParameters, 'headers'>;

export type PostParameters = IRequestParameters;

export type HttpVerb = 'GET' | 'POST' | 'PATCH' | 'PUT';

class RequestManager {
  private stack: IRequest[] = [];
  private defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  /// only allow one request per VERB+ENDPOINT+ACTION(if it is defined in the headers)
  pushToStack(id: string, ref: XMLHttpRequest) {
    const found = this.stack.find(req => req.id === id);
    if (found) {
      found.ref.abort();
      this.stack.splice(this.stack.indexOf(found), 1);
    }
    this.stack.push({ id, ref });
  }

  // The header.Purpose is used to avoid aborting /transform request if they are executed for different purposes
  request<T>(method: HttpVerb, url: string, parameters: IRequestParameters): Promise<T> {
    const { headers, body } = parameters;
    const composedHeaders = { ...this.defaultHeaders, ...headers };
    const composedBody = composedHeaders['Content-Type'] === 'application/json' ? JSON.stringify(body) : body;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);

      Object.keys(composedHeaders).forEach(key => {
        xhr.setRequestHeader(key, composedHeaders[key]);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(composedHeaders['Accept'] === 'application/json' ? JSON.parse(xhr.response) : xhr.response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };

      xhr.onerror = () => {
        reject({
          status: xhr.status,
          statusText: xhr.statusText
        });
      };

      if ('X-DataweaveAction' in headers)
        this.pushToStack(`${method}+${url}+${headers["X-DataweaveAction"]}`, xhr);
      else
        this.pushToStack(`${method}+${url}`, xhr);

      xhr.send(composedBody);
    });
  }

  get<T>(url: string, parameters: GetParameters): Promise<T> {
    return this.request<T>('GET', url, parameters);
  }

  post<T>(url: string, parameters: PostParameters): Promise<T> {
    return this.request<T>('POST', url, parameters);
  }

  patch<T>(url: string, parameters: PostParameters): Promise<T> {
    return this.request<T>('PATCH', url, parameters);
  }
}

export default RequestManager;
