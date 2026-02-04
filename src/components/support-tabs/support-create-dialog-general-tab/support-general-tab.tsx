import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Grid2, TextField,
  Box, Typography,
  Button, InputLabel,
  MenuItem, FormControl,
  Select, InputAdornment, SelectChangeEvent
} from '@mui/material';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Order, OrderState } from '../../../pages/support/all-support/makeData';
import { PhoneOutlined, AlternateEmail } from '@mui/icons-material';
import { TextInputField } from '../../text-input-field';

import { useQuery } from '@tanstack/react-query';
import { getOrderTypes } from '../../../api/services/orderTypeService';
import { getOrderStates } from '../../../api/services/orderStateService';
import { getOrderPriorities } from '../../../api/services/orderPriorityService';
import { getUsers } from '../../../api/services/userService';

interface SupportGeneralTabProps {
  isOpen: boolean;
  request: Order | null;
  onUpdate?: (data: any, hasChanges: boolean) => void;
}

export function SupportGeneralTab({ request, onUpdate }: SupportGeneralTabProps) {
  const [editedRequest, setEditedRequest] = useState<Order | null>(request);

  const isEditing = !editedRequest?.orderState?.name?.includes('Закрыта');              // флаг режима редактирования
  //const hasChanges = JSON.stringify(editedRequest) !== JSON.stringify(request);                      // флаг наличия изменений
  const hasChanges = useMemo(() => {
    if (!editedRequest || !request) return false;

    return (
      editedRequest.name !== request.name ||
      editedRequest.description !== request.description ||
      editedRequest.dateCreated !== request.dateCreated ||
      editedRequest.dateFinishPlan !== request.dateFinishPlan ||
      editedRequest.dateFinishFact !== request.dateFinishFact ||
      editedRequest.orderType?.idOrderType !== request.orderType?.idOrderType ||
      editedRequest.catalogItem?.idCatitem !== request.catalogItem?.idCatitem ||
      editedRequest.service?.idService !== request.service?.idService ||
      editedRequest.orderState?.idOrderState !== request.orderState?.idOrderState ||
      editedRequest.orderPriority?.idOrderPriority !== request.orderPriority?.idOrderPriority ||
      editedRequest.creator?.idItUser !== request.creator?.idItUser ||
      editedRequest.initiator?.idItUser !== request.initiator?.idItUser ||
      editedRequest.dispatcher?.idItUser !== request.dispatcher?.idItUser ||
      editedRequest.resultText !== request.resultText
    );
  }, [editedRequest, request]);

  const isInitialMount = useRef(true);

  const labelStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '5px',
    p: 1,
    backgroundColor: '#f5f5f5'
  };

  if (!editedRequest) {
    return <Typography>Заявка не выбрана</Typography>;
  }

  const handleSave = () => {
    // Здесь будет логика сохранения изменений
    //console.log('Сохранение данных:', editableRequest);
    //setHasChanges(false);
  };

  const handleCancel = () => {
    setEditedRequest(request); // Возвращаем оригинальные данные
    //setHasChanges(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditedRequest(prev => prev ? { ...prev, [field]: value } : null);
    //setHasChanges(true);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onUpdate) {
      onUpdate(editedRequest, hasChanges);
    }

  }, [editedRequest, hasChanges, onUpdate]);

  const handleChange = (field: string) => (event: any) => {
    const value = event.target.value;
    setEditedRequest(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleDateChange = (field: string, newDate: DateValue) => {
    const temp = dayjs(newDate);
    setEditedRequest(prev => prev ? { ...prev, [field]: temp } : null);
  };

  const handleOrderStateChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = orderStates.find(
      (item: any) => item.idOrderState === selectedId
    ) ?? null;

    setEditedRequest(prev => prev ? { ...prev, orderState: selectedObject } : null);

  };

  const handleOrderTypeChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = orderTypes.find(
      (item: any) => item.idOrderType === selectedId
    ) ?? null;

    setEditedRequest(prev => prev ? { ...prev, orderType: selectedObject } : null);

  };

  const handleOrderPriorityChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = orderPriorities.find(
      (item: any) => item.idOrderPriority === selectedId
    ) ?? null;

    setEditedRequest(prev =>
      prev ? { ...prev, orderPriority: selectedObject } : null
    );
  };

  const handleDispatcherChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = users.find(
      (item: any) => item.idItUser === selectedId
    ) ?? null;

    setEditedRequest(prev => prev ? { ...prev, dispatcher: selectedObject } : null);

  };

  const {
    data: users = [],
    isLoading: userLoad,
    error: userError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: Infinity
  });

  const {
    data: orderTypes = [],
    isLoading: orderLoad,
    error: orderError,
  } = useQuery({
    queryKey: ['ordertypes'],
    queryFn: getOrderTypes,
    staleTime: Infinity
  });

  const {
    data: orderStates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orderstates'],
    queryFn: getOrderStates,
  });

  const {
    data: orderPriorities = [],
    isLoading: orderPriorityLoad,
    error: orderPriorityError,
  } = useQuery({
    queryKey: ['orderpriorities'],
    queryFn: getOrderPriorities,
  });

  return (
    <Box sx={{ mt: 2, position: 'relative', minHeight: '500px' }}>
      {/* Первая строка - заголовки таблицы */}
      <Grid2 container spacing={0} paddingBottom="5px" justifyContent="center">

        <Grid2 container spacing={0} size={3}>
          <Grid2 size="auto" sx={labelStyle}>
            <Typography variant="subtitle2">Статус</Typography>
          </Grid2>
          <Grid2 size="auto">
            <FormControl sx={{ minWidth: 240 }} size="small">
              <Select
                value={editedRequest.orderState?.idOrderState || ''}
                onChange={handleOrderStateChange}
                renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = orderStates.find((x: any) => x.idOrderState === selected);
                    return p?.name;
                  }}
              >
                {orderStates.map((item: any) => (
                  <MenuItem key={item.idOrderState} value={item.idOrderState}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2 size="auto" sx={labelStyle}>
            <Typography variant="subtitle2">Дата регистрации</Typography>
          </Grid2>
          <Grid2 size="auto">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
                valueFormat="DD.MM.YYYY HH:mm"

                withSeconds={false}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                clearable
                locale='ru'
                size="md"
                styles={{ input: { minHeight: '40px' } }}
                readOnly={!isEditing}
                //В заявке даты - строка, тут - DateValue
                value={editedRequest?.dateCreated ? dayjs(editedRequest?.dateCreated).toDate() : null}
                onChange={(newDateCreated) => handleDateChange('dateCreated', newDateCreated)}
              />
            </LocalizationProvider>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2 size="auto" sx={labelStyle}>
            <Typography variant="subtitle2">Желаемый срок</Typography>
          </Grid2>
          <Grid2 size="auto">
            <DateTimePicker
              placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
              valueFormat="DD.MM.YYYY HH:mm"
              withSeconds={false}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              clearable
              locale='ru'
              size="md"
              styles={{ input: { minHeight: '40px' } }}
              readOnly={!isEditing}
              value={editedRequest?.dateFinishPlan ? dayjs(editedRequest?.dateFinishPlan).toDate() : null}
              onChange={(newDateFinishPlan) => handleDateChange('dateFinishPlan', newDateFinishPlan)}
            />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2 size="auto" sx={labelStyle}>
            <Typography variant="subtitle2">Дата решения</Typography>
          </Grid2>
          <Grid2 size="auto">
            <DateTimePicker
              placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
              valueFormat="DD.MM.YYYY HH:mm"
              withSeconds={false}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              clearable
              locale='ru'
              size="md"
              styles={{ input: { minHeight: '40px' } }}
              readOnly={!isEditing}
              value={editedRequest?.dateFinishFact ? dayjs(editedRequest?.dateFinishFact).toDate() : null}
              onChange={(newDateFinishFact) => handleDateChange('dateFinishFact', newDateFinishFact)}
            />
          </Grid2>
        </Grid2>
      </Grid2>


      {/* Основная таблица */}
      <Grid2 container spacing={0}>
        {/* Левая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Сервис / Модуль</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.service?.fullname || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('itModule')}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Услуга</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.catalogItem?.name || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('service')}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Кому доступ</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('accessTo')}
                disabled={editedRequest.orderType?.name === 'ЗНД' ? false : true}
                value={editedRequest.orderType?.name === 'ЗНД' ? editedRequest.initiator?.fio1c : 'Не тот тип заявки'}
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Заголовок</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.name || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('name')}
              />
            </Grid2>
          </Grid2>

          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Описание</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextInputField
                value={editedRequest.description || ''}
                onChange={handleChange('description')}
                readonly={!isEditing}
              />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Решение</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextInputField
                value={editedRequest.resultText || ''}
                onChange={handleChange('resultText')}
                readonly={!isEditing}
              />
            </Grid2>
          </Grid2>

          {/* Строка 7 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Комментарий</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextInputField
                value={''}
                onChange={handleChange('comment')}
                readonly={!isEditing}
              />
            </Grid2>
          </Grid2>

          {/* Строка 8 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Диспетчер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <FormControl fullWidth size="small">
                <Select
                  value={editedRequest.dispatcher?.idItUser || ''}
                  onChange={handleDispatcherChange}

                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = users.find((x: any) => x.idItUser === selected);
                    return p?.fio1c;
                  }}
                >
                  {users.map((item: any) => (
                    <MenuItem key={item.idItUser} value={item.idItUser}>
                      {item.fio1c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Правая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}


          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Отложено до</Typography>
            </Grid2>
            <Grid2 size={9}>
              <DateTimePicker
                placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
                valueFormat="DD.MM.YYYY HH:mm"
                withSeconds={false}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                clearable
                locale='ru'
                size="md"
                styles={{ input: { minHeight: '40px' } }}
                readOnly={!isEditing}
              //value={editedRequest?.dateFinishFact ? dayjs(editedRequest?.dateFinishFact).toDate() : null}
              //onChange={(newDateFinishFact) => handleDateChange('dateFinishFact', newDateFinishFact)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}


          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Дата возврата техники</Typography>
            </Grid2>
            <Grid2 size={9}>
              <DateTimePicker
                placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
                valueFormat="DD.MM.YYYY HH:mm"
                withSeconds={false}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                clearable
                locale='ru'
                size="md"
                styles={{ input: { minHeight: '40px' } }}
                readOnly={!isEditing}
                value={editedRequest?.dateFinishPlan ? dayjs(editedRequest?.dateFinishPlan).toDate() : null}
                onChange={(newDateFinishPlan) => handleDateChange('dateFinishPlan', newDateFinishPlan)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Тип заявки</Typography>
            </Grid2>
            <Grid2 size={9}>
              <FormControl fullWidth size="small">
                <Select
                  value={editedRequest.orderType?.idOrderType || ''}
                  onChange={handleOrderTypeChange}

                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = orderTypes.find((x: any) => x.idOrderType === selected);
                    return p?.name;
                  }}
                >
                  {orderTypes.map((item: any) => (
                    <MenuItem key={item.idOrderType} value={item.idOrderType}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          {/* Строка 7 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Приоритет</Typography>
            </Grid2>
            <Grid2 size={9}>
              <FormControl fullWidth size="small">
                <Select
                  value={editedRequest.orderPriority?.idOrderPriority || ''}
                  onChange={handleOrderPriorityChange}

                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = orderPriorities.find((x: any) => x.idOrderPriority === selected);
                    return p?.name;
                  }}
                >
                  {orderPriorities.map((item: any) => (
                    <MenuItem key={item.idOrderPriority} value={item.idOrderPriority}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          {/* Строка 8 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Способ обращения</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={1}
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('contactMethod')}
              />
            </Grid2>
          </Grid2>

          {/* Строка 9 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">База знаний по системе</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={1}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('knowledgeBase', e.target.value)}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Заголовок раздела */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Информация о заявителе
      </Typography>

      {/* Таблица информации о заявителе */}
      <Grid2 container spacing={0}>
        {/* Левая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Инициатор</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.initiator?.fio1c || ''}
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Должность</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Grid2>
          </Grid2>
          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Подразделение</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
              />
            </Grid2>
          </Grid2>
        </Grid2>
        {/* Правая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Вн. номер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Сот. номер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneOutlined />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Почта</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                slotProps={{
                  input: {
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <AlternateEmail />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}