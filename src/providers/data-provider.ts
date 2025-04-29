import type { DataProvider } from "@refinedev/core";

const API_URL = "http://217.12.40.66:8080";

export const dataProvider: DataProvider = {
    // Получение одного ресурса по ID
    getOne: async ({ resource, id, meta }) => {
        const token = localStorage.getItem("my_access_token");
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${resource}/${id}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    },

    // Обновление ресурса
    update: async ({ resource, id, variables }) => {
        const token = localStorage.getItem("my_access_token");
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(variables),
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to update ${resource}/${id}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    },

    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        const token = localStorage.getItem("my_access_token");
        const url = new URL(`${API_URL}/${resource}`);
        const params = new URLSearchParams();

        // Пагинация
        if (pagination) {
            const { current = 1, pageSize = 10 } = pagination;
            params.append('page', current.toString());
            params.append('size', pageSize.toString());
        }

        // Сортировка
        if (sorters && sorters.length > 0) {
            sorters.forEach(sorter => {
                if (sorter.field && sorter.order) {
                    params.append('sort', `${sorter.field},${sorter.order}`);
                }
            });
        }

        // Фильтрация
        if (filters && filters.length > 0) {
            filters.forEach(filter => {
                // Обработка логических фильтров (and/or)
                if ('key' in filter && filter.key === 'and') {
                    // Здесь можно обработать сложные условия and/or
                    console.warn('Complex filters (and/or) not implemented');
                    return;
                }

                // Базовый фильтр с полем и значением
                if ('field' in filter && 'value' in filter) {
                    const operator = filter.operator || 'eq';

                    // Простая фильтрация (field=value)
                    if (operator === 'eq') {
                        params.append(filter.field, filter.value);
                    }
                    // Фильтрация с оператором (field[operator]=value)
                    else {
                        params.append(`${filter.field}[${operator}]`, filter.value);
                    }
                }
            });
        }

        // Добавляем параметры в URL
        url.search = params.toString();

        const response = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${resource}: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            data: Array.isArray(data) ? data : data?.data || [],
            total: data?.total || data?.length || 0,
        };
    },

    // Создание нового ресурса
    create: async ({ resource, variables }) => {
        const token = localStorage.getItem("my_access_token");
        const response = await fetch(`${API_URL}/${resource}`, {
            method: "POST",
            body: JSON.stringify(variables),
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to create ${resource}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    },

    // Удаление ресурса
    deleteOne: async ({ resource, id }) => {
        const token = localStorage.getItem("my_access_token");
        const response = await fetch(`${API_URL}/${resource}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to delete ${resource}/${id}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    },

    // Возвращаем базовый URL API
    getApiUrl: () => API_URL,

    // Опциональные методы (можно реализовать позже, если нужно)
    getMany: async ({ resource, ids }) => {
        const token = localStorage.getItem("my_access_token");
        const url = `${API_URL}/${resource}?ids=${ids.join(",")}`;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch many ${resource}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    },

    // Пример реализации custom метода для произвольных запросов
    custom: async ({ url, method = "GET", headers, payload }) => {
        const token = localStorage.getItem("my_access_token");
        const response = await fetch(url, {
            method,
            body: payload ? JSON.stringify(payload) : undefined,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...headers,
            },
        });

        if (!response.ok) {
            throw new Error(`Custom request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    },
};