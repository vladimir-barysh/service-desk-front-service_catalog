import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef, GridRowModel, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { getAuthorities } from '../../api/services/authorityService';
import { getOrderTypes } from '../../api/services/orderTypeService';
import { getOrderStates } from '../../api/services/orderStateService';
import { getUsers } from '../../api/services/userService';
import { getServices } from '../../api/services/ServiceService';
import { Service, User } from '../../api/models';
import { formatFIO } from '../../components';
import dayjs from 'dayjs';

interface DictionaryMeta {
  key: string;
  title: string;
  apiEndpoint?: string;
  columns: GridColDef[];
}

interface DictionaryItem {
  id: number | string;
  [key: string]: any; // остальные поля зависят от справочника
}

const DICTIONARIES: DictionaryMeta[] = [
  {
    key: 'user',
    title: 'Сотрудники',
    apiEndpoint: '/api/user',
    columns: [
      { field: 'id', headerName: '№', width: 20, editable: false, resizable: false },
      { field: 'fio1c', headerName: 'ФИО', width: 150, type: 'string', editable: false, resizable: false },
      { field: 'podr', headerName: 'Подразделение', minWidth: 170, type: 'string',  editable: false },
      { field: 'dolzh1c', headerName: 'Должность', minWidth: 170, type: 'string',  editable: false },
      { field: 'tabNum1c', headerName: 'Таб. номер', minWidth: 120, type: 'string',  editable: false },
      { field: 'sost', headerName: 'Состояние', minWidth: 100, type: 'string',  editable: false },
      { field: 'telAd', headerName: 'Вн. телефон', minWidth: 140, type: 'string',  editable: false },
      { field: 'telSot', headerName: 'Сот. телефон', minWidth: 140, type: 'string',  editable: false },
      { field: 'emailAd', headerName: 'E-Mail: Рабочий', minWidth: 150, type: 'string',  editable: false }
    ],
  },
  {
    key: 'accessright',
    title: 'Права доступа',
    columns: [
      { field: 'id', headerName: '№', width: 20, editable: false, resizable: false },
      { field: 'name', headerName: 'Права доступа', width: 200, type: 'string',  editable: false, resizable: false },
      { field: 'description', headerName: 'Описание', width: 300, type: 'string',  editable: true, resizable: false }
    ],
  },
  {
    key: 'group',
    title: 'Рабочие группы',
    columns: [
      { field: 'id', headerName: '№', width: 20, editable: false, resizable: false },
      { field: 'name', headerName: 'Наименование', width: 200, type: 'string',  editable: false, resizable: false },
      { field: 'date', headerName: 'Сотрудники рабочей группы на', width: 300, type: 'string',  editable: true, resizable: false },
      { field: 'users', headerName: 'Сотрудники', width: 20, type: 'string',  editable: false}
    ],
  },
  {
    key: 'services',
    title: 'ИТ сервисы',
    apiEndpoint: '/api/service',
    columns: [
      { field: 'id', headerName: '№', width: 20, type: 'number', editable: false, resizable: false },
      { field: 'sname', headerName: 'Краткое наименование', width: 150, type: 'string', editable: true },
      { field: 'fullname', headerName: 'Полное наименование', width: 280, type: 'string', editable: true },
      { field: 'serviceParent', headerName: 'Родительский сервис', width: 20, type: 'number', editable: true },
      { field: 'description', headerName: 'Описание', width: 200, type: 'string', editable: true },
      { field: 'basisS', headerName: 'Основание', width: 110, type: 'string', editable: true },
      { field: 'developer', headerName: 'Разработчик', width: 110, type: 'string', editable: true },
      { field: 'dateS', headerName: 'Дата ввода в эксплуатацию', width: 110, type: 'string', editable: true },
      { field: 'dateF', headerName: 'Дата вывода из эксплуатации', width: 110, type: 'string', editable: true },
      { field: 'serviceState', headerName: 'Статус', width: 110, type: 'string', editable: true },
      { field: 'priznakIs', headerName: 'Является ИС', width: 110, type: 'boolean', editable: true },
      { field: 'isNeedApproval', headerName: 'Требует согласование', width: 110, type: 'boolean', editable: true },
      { field: 'isService', headerName: 'Является сервисом', width: 110, type: 'boolean', editable: true },
      { field: 'businessCritical', headerName: 'Критичность для бизнеса', width: 110, type: 'string', editable: true },
      { field: 'a', headerName: 'Связанные услуги', width: 110, type: 'string', editable: true },
      { field: 'b', headerName: 'Роли пользователей сервиса', width: 110, type: 'string', editable: true },
      { field: 'c', headerName: 'Работы по сервису', width: 110, type: 'string', editable: true },
      { field: 'd', headerName: 'Права', width: 110, type: 'string', editable: true },
      { field: 'e', headerName: 'Шаблон заявки', width: 110, type: 'string', editable: true },
    ],
  },
  {
    key: 'ordertype',
    title: 'Тип заявки',
    apiEndpoint: '/api/ordertype',
    columns: [
      { field: 'name', headerName: 'Название', width: 220, editable: true },
      { field: 'available', headerName: 'Активна', width: 110, type: 'boolean', editable: true },
    ],
  },
  {
    key: 'orderstate',
    title: 'Статус заявки',
    apiEndpoint: '/api/orderstate',
    columns: [
      { field: 'name', headerName: 'Название', width: 220, editable: true },
    ],
  },
  {
    key: 'authority',
    title: 'Должности',
    apiEndpoint: '/api/authority',
    columns: [
      { field: 'id', headerName: 'ID', width: 80, editable: false },
      { field: 'name', headerName: 'Название', width: 220, editable: true },
      { field: 'code', headerName: 'Код', width: 120, editable: true },
      { field: 'sortOrder', headerName: 'Порядок', width: 100, type: 'number', editable: true },
    ],
  },
  
  {
    key: 'roles',
    title: 'Роли',
    apiEndpoint: '/api/roles',
    columns: [
      { field: 'id', headerName: 'ID', width: 80, editable: false },
      { field: 'name', headerName: 'Название роли', width: 240, editable: true },
      { field: 'description', headerName: 'Описание', width: 300, editable: true },
    ],
  },
  // Добавляй новые справочники сюда с нужными колонками
];

function DictionaryTable({
  dictionary,
  items,
  onRefresh,
}: {
  dictionary: DictionaryMeta;
  items: DictionaryItem[];
  onRefresh: () => void;
}) {
  const [rows, setRows] = useState<DictionaryItem[]>(items);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [newName, setNewName] = useState('');

  useEffect(() => {
    setRows(items);
  }, [items]);

  const handleRowEditStop = (params: any) => {
    if (params.reason === 'rowEditStop') {
      setRowModesModel((prev) => ({
        ...prev,
        [params.id]: { mode: GridRowModes.View },
      }));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    // Явно приводим к нашему типу (после того, как убедились, что id есть)
    const updatedRow = newRow as DictionaryItem;

    // Опционально: защита на случай, если id пропал (маловероятно, но TypeScript успокаивается)
    if (!updatedRow.id) {
      throw new Error("Row without id received from DataGrid");
    }

    // ... запрос на сервер ...

    setRows(prev =>
      prev.map(r => r.id === updatedRow.id ? updatedRow : r)
    );

    return updatedRow;
  }

  const handleProcessRowUpdateError = (error: any) => {
    console.error('Ошибка сохранения:', error);
    // Здесь можно показать уведомление
  };

  const handleAdd = () => {
    if (!newName.trim()) return;

    const newId = Math.max(...rows.map((r) => Number(r.id)), 0) + 1;

    const newItem: DictionaryItem = {
      id: newId,
      name: newName,
      // Добавь дефолтные значения для других полей, если нужно
    };

    // Симуляция POST
    console.log('Добавление:', dictionary.key, newItem);
    setRows((prev) => [...prev, newItem]);
    // await fetch(dictionary.apiEndpoint, { method: 'POST', body: JSON.stringify(newItem) });

    setNewName('');
    onRefresh(); // если нужно перезагружать с сервера
  };

  const handleDelete = (id: number | string) => {
    if (!window.confirm('Удалить запись?')) return;
    console.log('Удаление:', dictionary.key, id);
    setRows((prev) => prev.filter((r) => r.id !== id));
    // await fetch(`${dictionary.apiEndpoint}/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const columns = useMemo<GridColDef[]>(() => {
    return [
      ...dictionary.columns,
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Действия',
        width: 100,
        resizable: false,
        getActions: (params) => {
          const isInEdit = rowModesModel[params.id]?.mode === GridRowModes.Edit;

          if (isInEdit) {
            return [
              <Button
                key="save"
                size="small"
                variant="contained"
                onClick={() =>
                  setRowModesModel((prev) => ({
                    ...prev,
                    [params.id]: { mode: GridRowModes.View },
                  }))
                }
              >
                Сохранить
              </Button>,
              <Button
                key="cancel"
                size="small"
                onClick={() =>
                  setRowModesModel((prev) => ({
                    ...prev,
                    [params.id]: { mode: GridRowModes.View, ignoreModifications: true },
                  }))
                }
              >
                Отмена
              </Button>,
            ];
          }

          return [
            <Tooltip title="Редактировать" key="edit">
              <IconButton
                size="small"
                onClick={() =>
                  setRowModesModel((prev) => ({
                    ...prev,
                    [params.id]: { mode: GridRowModes.Edit },
                  }))
                }
              >
                ✏️
              </IconButton>
            </Tooltip>,
            <Tooltip title="Удалить" key="delete">
              <IconButton size="small" color="error" onClick={() => handleDelete(params.id)}>
                🗑
              </IconButton>
            </Tooltip>,
          ];
        },
      },
    ];
  }, [dictionary.columns, rowModesModel]);

  return (
    <Box sx={{ height: 'calc(100vh - 180px)', width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          label="Новое значение (название)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={!newName.trim()}>
          Добавить
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          '& .actions': { display: 'flex', alignItems: 'center', gap: 1 },
        }}
      />
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────

export function ManualPage() {
  const [selectedDict, setSelectedDict] = useState<DictionaryMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorq, setError] = useState<string | null>(null);
  const [dictData, setDictData] = useState<Record<string, DictionaryItem[]>>({});

  useEffect(() => {
    if (selectedDict && !dictData[selectedDict.key]) {
      loadDictionary(selectedDict);
    }
  }, [selectedDict]);

  const { 
    data: users = [],
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const {
    data: authorities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['authorities'],
    queryFn: getAuthorities,
  });

  const {
    data: orderTypes = [],
    isLoading: isLoadingOrderTypes,
    isError: isErrorOrderTypes,
    error: orderTypesError,
  } = useQuery({
    queryKey: ['ordertypes'],
    queryFn: getOrderTypes,
  });

  const {
    data: orderStates = [],
    isLoading: isLoadingOrderStates,
    isError: isErrorOrderStates,
    error: orderStatesError,
  } = useQuery({
    queryKey: ['orderstates'],
    queryFn: getOrderStates,
  });

  const {
    data: services = [],
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: servicesError,
  } = useQuery({
    queryKey: ['orderservices'],
    queryFn: getServices,
  });

  const loadDictionary = async (dict: DictionaryMeta) => {
    setLoading(true);
    setError(null);

    try {
      if (dict.key === 'user') {
        const formatted = users.map((u: User, index: number) => ({
          id: index + 1,
          fio1c: formatFIO(u.fio1c || ''),
          podr: u.podr?.name,
          dolzh1c: u.dolzh1c,
          tabNum1c: u.tabNum1c,
          sost: 0,
          telAd: u.telAd,
          emailAd: u.emailAd
        }));
        setDictData(prev => ({ ...prev, [dict.key]: formatted }));
      }
      else if (dict.key === 'accessright') {
        const formatted = orderTypes.map((item: any, index: number) => ({
          id: index + 1,
          name: item.name,
          available: item.description
        }));
        setDictData(prev => ({ ...prev, [dict.key]: formatted }));
      } 
      else if (dict.key === 'ordertype') {
        const formatted = orderTypes.map((item: any) => ({
          id: item.idOrderType,
          name: item.name,
          available: item.available,
        }));
        setDictData(prev => ({ ...prev, [dict.key]: formatted }));
      } 
      else if (dict.key === 'orderstate') {
        const formatted = orderStates.map((item: any) => ({
          id: item.idOrderState,
          name: item.name
        }));

        setDictData(prev => ({ ...prev, [dict.key]: formatted }));
      } 
      else if (dict.key === 'authority') {
        // ← вот здесь используем данные из useQuery
        const formatted = authorities.map((item: any) => ({
          id: item.id || item.authorityId || item.code,       // подставь реальное поле
          name: item.name || item.title || item.authority,    // название должности
          code: item.code || item.shortName || '',
          sortOrder: item.sortOrder || 0,
          // ... другие поля, которые есть в твоём справочнике
        }));

        setDictData(prev => ({ ...prev, [dict.key]: formatted }));
      } else if (dict.key == 'services') {
        const formatted = services.map(( s: Service, index: number ) => ({
          id: index + 1,
          sname: s.sname,
          fullname: s.fullname, 
          serviceParent: s.serviceParent?.idService,
          description: s.description,
          basisS: s.basisS,
          developer: s.developer,
          dateS: s.dateS ? dayjs(s.dateS).format('DD.MM.YYYY') : '',
          dateF: s.dateF ? dayjs(s.dateF).format('DD.MM.YYYY') : '',
          serviceState: s.serviceState?.name,
          priznakIs: s.priznakIs,
          isNeedApproval: s.isNeedApproval,
          isService: s.isService,
          businessCritical: s.businessCritical,

        }))
        setDictData(prev => ({ ...prev, [dict.key]: formatted }));
      } else {
        //
      }
    } catch (err) {
      setError('Не удалось загрузить справочник');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (dict: DictionaryMeta) => {
    setSelectedDict(dict);
  };

  return (
    <Box sx={{ minHeight: '50vh', height: '96vh', padding: '0px 0px 10px 0px', display: 'flex', flexDirection: 'column' }}>
      <Grid container component={Paper} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Список справочников */}
        <Grid item xs={12} md={2} sx={{ borderRight: '1px solid #e0e0e0', overflowY: 'auto' }}>
          <Typography variant="h6" align='center' padding='8px 0px 8px 0px' sx={{ borderBottom: '1px solid #e0e0e0' }}>
            Список справочников
          </Typography>
          <List disablePadding>
            {DICTIONARIES.map((dict) => (
              <React.Fragment key={dict.key}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedDict?.key === dict.key}
                    onClick={() => handleSelect(dict)}
                  >
                    <ListItemText primary={dict.title} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Grid>

        {/* Таблица */}
        <Grid item xs={12} md={10} sx={{ p: 3 }}>
          {!selectedDict ? (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Выберите справочник</Typography>
            </Box>
          ) : isLoading ? (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error instanceof Error ? error.message : 'Неизвестная ошибка'}</Alert>
          ) : !dictData[selectedDict.key]?.length ? (
            <Alert severity="info"> Данный справочник пока что пуст</Alert>
          ) : (
            <DictionaryTable
              dictionary={selectedDict}
              items={dictData[selectedDict.key] || []}
              onRefresh={() => loadDictionary(selectedDict)}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}