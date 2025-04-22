type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
    method: HttpMethod;
    url: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
}

async function apiRequest<T>({ method, url, headers, body }: ApiRequestOptions): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}\n ${await response.text()}`);
    }

    return response.json() as Promise<T>;
}

export {
    apiRequest
};
