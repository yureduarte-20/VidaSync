export type FetcherParamType = {
    uri: string;
    data?: any;
    method: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH',
    headers?: { [prop: string]: string }
}
export type Response<T> = {
    status: number;
    body: T
}
const BASE_URL = 'https://api.yuresamarone.shop/api/v1'
export async function useFetcher<T = any>({ method = 'GET', uri, data, headers }: FetcherParamType): Promise<Response<T>> {
    return new Promise((res, rej) => {
        let url = uri;
        if (url.startsWith('/')) {
            url = BASE_URL + url;
        } else {
            url = BASE_URL + '/' + url;
        }
        const h = new Headers();
        h.append('Accept', 'application/json')
        h.append('Content-Type', 'application/json')
        if (headers) {
            for (const key in headers) {
                h.append(key, headers[key])
            }

        }

        let body: any = data

        if (typeof data == 'object') {
            body = JSON.stringify(data)
        }
        fetch(url, {
            method,
            headers: h,
            credentials: 'include',
            body,
        })
            .then(
                async response => response.status < 300 ?
                    res({ body: response.status === 204 ? {} as  T : await response.json() as T, status: response.status }) : rej({ body: await response.json(), status: response.status, code: 'RESPONSE_ERROR' })
            )
            .catch(e => rej({ message: 'Falha ao tentar se cominicar com o servidor', error: e, code: 'NETWORK_ERROR' }))

    })
}