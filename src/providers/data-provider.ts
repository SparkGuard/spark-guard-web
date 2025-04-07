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

    // Получение списка ресурсов
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        const token = localStorage.getItem("my_access_token");
        let url = `${API_URL}/${resource}`;

        // Добавляем пагинацию, если она указана
        if (pagination) {
            const { current, pageSize } = pagination;
            url += `?page=${current}&size=${pageSize}`;
        }

        // Добавляем сортировку, если указана
        if (sorters && sorters.length > 0) {
            const sortParams = sorters.map((sorter) => `sort=${sorter.field},${sorter.order}`).join("&");
            url += `${pagination ? "&" : "?"}${sortParams}`;
        }

        // Добавляем фильтры, если указаны (предполагаем простой формат)
        if (filters && filters.length > 0) {
            const filterParams = filters.map((filter) => `${filter.field}=${filter.value}`).join("&");
            url += `${pagination || sorters ? "&" : "?"}${filterParams}`;
        }

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch list of ${resource}: ${response.statusText}`);
        }

        const data = await response.json();
        // Предполагаем, что API возвращает массив или объект с полями data и total
        return {
            data: Array.isArray(data) ? data : data.data || [],
            total: data.total || 0, // Уточни в Swagger, как API возвращает общее количество
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