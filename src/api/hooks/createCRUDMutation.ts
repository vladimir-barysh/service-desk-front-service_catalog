/*
 * Фабрика CRUD мутаций для React Query
 *
 * Использование:
 * - Создание: { type: 'create', mutationFn, queryKey, successMessage, addToCache? }
 * - Обновление: { type: 'update', mutationFn, queryKey, getEntityId, idField?, merge?, updateCache?, successMessage }
 * - Удаление:   { type: 'delete', mutationFn, queryKey, getEntityId, idField?, deleteFromCache?, successMessage }
 *
 * Дополнительные параметры:
 * - addToCache        – как добавить новый элемент в кэш сразу после создания. По умолчанию: ничего не добавляет, список просто перезапросится с сервера
 * - idField           – если поле ID объекта называется как-то иначе (например 'idOrder')
 * - merge             – как объединить старый объект из кэша с новыми данными с сервера. По умолчанию: { ...oldItem, ...newItem } (поверхностное копирование)
 * - updateCache       – как именно обновить элемент в кэше. По умолчанию: ищет элемент по idField и делает { ...oldItem, ...newItem } (поверхностное слияние)
 * - deleteFromCache   – как именно удалить элемент из кэша. По умолчанию: удаляет по idField (например, item.idOrder !== id)
 * - onSuccessMutate   – дополнительные действия после успешной мутации. Выполняется после того, как обновлён кэш
 *
 * Если кэш обычный массив плоских объектов с единым полем ID – достаточно idField.
 * Если кэш сложный (объект, дерево и тд.) – нужно передать свои updateCache/deleteFromCache
 */

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { showNotification } from './../../context';

// Типы операций
type MutationType = 'create' | 'update' | 'delete';

// Базовый конфиг для всех операций
interface BaseConfig<TVariables, TResponse> {
  mutationFn: (vars: TVariables) => Promise<TResponse>;
  queryKey: string[];
  successMessage: string;
  errorMessage?: string;
  onSuccessMutate?: (data: TResponse, vars: TVariables, queryClient: any) => void;
}

// Конфиг для обновления
interface UpdateConfig<TVariables, TResponse> extends BaseConfig<TVariables, TResponse> {
  type: 'update';
  getEntityId: (vars: TVariables) => string | number;
  idField?: string;                                                             
  merge?: (oldItem: any, newItem: TResponse) => any;                          
  updateCache?: (old: any[], newItem: TResponse, id: string | number) => any[];
}

// Конфиг для удаления
interface DeleteConfig<TVariables, TResponse> extends BaseConfig<TVariables, TResponse> {
  type: 'delete';
  idField?: string;                                                             
  getEntityId: (vars: TVariables) => string | number;
  deleteFromCache?: (old: any[], id: string | number) => any[];             
}

// Конфиг для создания
interface CreateConfig<TVariables, TResponse> extends BaseConfig<TVariables, TResponse> {
  type: 'create';
  addToCache?: (old: any[] | undefined, newItem: TResponse) => any[];
}

// Объединение типов
type MutationConfig<TVariables, TResponse> =
  | CreateConfig<TVariables, TResponse>
  | UpdateConfig<TVariables, TResponse>
  | DeleteConfig<TVariables, TResponse>;

export function createCRUDMutation<TVariables, TResponse>(
  config: MutationConfig<TVariables, TResponse>
): () => UseMutationResult<TResponse, Error, TVariables> {
  return () => {
    const queryClient = useQueryClient();
    const { mutationFn, queryKey, successMessage, errorMessage, onSuccessMutate } = config;

    return useMutation({
      mutationFn,
      onSuccess: (data, variables) => {
        // Сброс основного кэша
        queryClient.invalidateQueries({ queryKey });

        // Оптимистичное обновление кэша
        if (config.type === 'update') {
          const id = config.getEntityId(variables);
          const idField = config.idField || 'id';
          const updateCache = config.updateCache || ((old, newItem, id) => 
            old.map(item => 
              item[idField] === id 
                ? (config.merge ? config.merge(item, newItem) : { ...item, ...newItem })
                : item
            )
          );
          queryClient.setQueryData(config.queryKey, (old: any[] | undefined) => {
            if (!old) return old;
            return updateCache(old, data, id);
          });
        } else if (config.type === 'delete') {
          const id = config.getEntityId(variables);
          const idField = config.idField || 'id';
          const deleteFromCache = config.deleteFromCache || ((old, id) =>
            old.filter(item => item[idField] !== id)
          );
          queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
            if (!old) return old;
            return deleteFromCache(old, id);
          });
        } else if (config.type === 'create' && config.addToCache) {
          queryClient.setQueryData(queryKey, (old: any[] | undefined) => {
            return config.addToCache!(old, data);
          });
        }

        // Пользовательская функция после успешного выполнения
        if (onSuccessMutate) onSuccessMutate(data, variables, queryClient);

        // Уведомление
        showNotification({ title: successMessage, message: '', color: 'green' });
      },
      onError: (error: any) => {
        showNotification({
          title: 'Ошибка',
          message: error?.response?.data?.message || error.message || (errorMessage || 'Операция не выполнена'),
          color: 'red',
        });
      },
    });
  };
}