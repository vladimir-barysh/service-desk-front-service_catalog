import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Grid2, TextField,
  Box, Typography,
  MenuItem, FormControl,
  Select, InputAdornment, SelectChangeEvent,
  Autocomplete
} from '@mui/material';
import { DateTimePicker, DateValue } from '@mantine/dates';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PhoneOutlined, AlternateEmail } from '@mui/icons-material';
import { TextInputField } from '../../text-input-field';

import { useUsers } from '../../../hooks/useUser';
import { usePodrs } from '../../../hooks/usePodr';
import { useOrderPriorities } from '../../../hooks/useOrderPriority';
import { useOrderTypes } from '../../../hooks/useOrderType';
import { components } from '../../../types/api';
type Order = components['schemas']['OrderResponseDTO'];
type OrderPriority = components['schemas']['OrderPriorityResponseDTO'];
type OrderType = components['schemas']['OrderTypeResponseDTO'];
type Podr = components['schemas']['PodrResponseDTO'];
type User = components['schemas']['UserResponseDTO'];

interface SupportGeneralTabProps {
  isOpen: boolean;
  request: Order | null;
  disabled: boolean;
  onUpdate?: (data: Order, hasChanges: boolean) => void;
}

export function SupportGeneralTab({ request, disabled, onUpdate }: SupportGeneralTabProps) {

  const [editedRequest, setEditedRequest] = useState<Order | null>(request);

  const isEditing = !editedRequest?.orderStateName?.includes('Закрыта');              // флаг режима редактирования
  //const hasChanges = JSON.stringify(editedRequest) !== JSON.stringify(request);                      // флаг наличия изменений
  const hasChanges = useMemo(() => {
    if (!editedRequest || !request) return false;

    return (
      editedRequest.name !== request.name ||
      editedRequest.comment !== request.comment ||
      editedRequest.description !== request.description ||
      editedRequest.dateCreated !== request.dateCreated ||
      editedRequest.dateFinishPlan !== request.dateFinishPlan ||
      editedRequest.dateFinishFact !== request.dateFinishFact ||
      editedRequest.datePostpone !== request.datePostpone ||
      editedRequest.dateTechReturn !== request.dateTechReturn ||
      editedRequest.orderTypeId !== request.orderTypeId ||
      editedRequest.catalogItemId !== request.catalogItemId ||
      editedRequest.serviceId !== request.serviceId ||
      editedRequest.orderStateId !== request.orderStateId ||
      editedRequest.orderPriorityId !== request.orderPriorityId ||
      editedRequest.creatorId !== request.creatorId ||
      editedRequest.initiatorId !== request.initiatorId ||
      editedRequest.dispatcherId !== request.dispatcherId ||
      editedRequest.resultText !== request.resultText
    );
  }, [editedRequest, request]);

  const isInitialMount = useRef(true);

  const labelStyle = {
    backgroundColor: '#f5f5f5',
    border: 'solid #c7c7c7',
    borderWidth: '1px',
    borderRadius: '0px',
    p: 1,
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px 1px 0 1px',
      },
      '&:hover fieldset': {
        borderWidth: '1px',
      },
      borderRadius: 0,
      height: 41
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      backgroundColor: '#f5f5f5',
      '&:hover fieldset': {
        borderWidth: '1px 1px 0px 1px'
      }
    }
  };

  const multilineTextFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px',
      },
      '&:hover fieldset': {
        borderWidth: '1px',
      },
      borderRadius: '0px 0px 5px 0px',
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      backgroundColor: '#f5f5f5',
      '&:hover fieldset': {
        borderWidth: '1px 1px 0px 1px'
      }
    }
  }

  const dateInputStyle = {
    input: {
      borderColor: '#c7c7c7',
      borderRadius: '0px',
      minHeight: '41px',
      '&:hover': {
        borderColor: 'black',
        borderWidth: '1px'
      },
      '&:focus': {
        borderWidth: '1px'
      },
      '&[data-disabled]': {
        backgroundColor: '#ececec',
        borderColor: '#979797',
        cursor: 'not-allowed',
      },
    }
  };

  const selectInputStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px 1px 0px 1px',
      },
      '&:hover fieldset': {
        borderWidth: '1px',
      },
      borderRadius: 0,
      height: 41,
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      backgroundColor: '#f5f5f5',
      '&:hover fieldset': {
        borderWidth: '1px 1px 0px 1px'
      }
    }
  };

  if (!editedRequest) {
    return <Typography>Заявка не выбрана</Typography>;
  }

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

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setEditedRequest(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleDateChange = (field: string, newDate: DateValue) => {
    const temp = newDate ? dayjs(newDate) : '';
    setEditedRequest(prev => prev ? { ...prev, [field]: temp } : null);
  };

  const handleOrderTypeChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = orderTypes.find((item: OrderType) => item.idOrderType === selectedId);

    if (!selectedObject) return;

    setEditedRequest(prev => prev ? { ...prev, orderTypeId: selectedObject.idOrderType, orderTypeName: selectedObject.name } : null);

  };

  const handleOrderPriorityChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = orderPriorities.find((item: OrderPriority) => item.idOrderPriority === selectedId);

    if (!selectedObject) return;

    setEditedRequest(prev =>
      prev ? { ...prev, orderPriorityId: selectedObject.idOrderPriority } : null
    );
  };

  const handleDispatcherChange = (id: number | null) => {
    if (id) {
      const selectedObject = users.find((item: User) => item.idItUser === id);

      if (!selectedObject) return;

      setEditedRequest(prev => prev ? { ...prev, dispatcherId: selectedObject.idItUser, dispatcherFio: selectedObject.fio1c } : null);
    } else {
      setEditedRequest(prev => prev ? { ...prev, dispatcherId: null, dispatcherFio: null } : null)
    }

  };

  const { data: users = [] } = useUsers();

  const { data: orderTypes = [] } = useOrderTypes();

  const { data: orderPriorities = [] } = useOrderPriorities();

  const { data: podrs = [] } = usePodrs();

  const initiator = useMemo(() => {
    if (!editedRequest?.initiatorId) return null;
    return users.find((u: User) => u.idItUser === editedRequest.initiatorId);
  }, [users, editedRequest]);

  const podrInit = useMemo(() => {
    if (!initiator?.podrId) return null;
    return podrs.find((p: Podr) => p.idPodr === initiator.podrId);
  }, [podrs, initiator]);

  const addWorkDays = (startDate: Date, daysToAdd: number): Date => {
    const result = new Date(startDate);
    let addedDays = 0;

    while (addedDays < daysToAdd) {
      result.setDate(result.getDate() + 1);
      // Если это рабочий день (пн-пт), увеличиваем счетчик
      if (result.getDay() !== 0 && result.getDay() !== 6) {
        addedDays++;
      }
    }

    return result;
  };

  const getMinDate = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (editedRequest?.orderTypeName === 'ЗНО') {
      return addWorkDays(today, 3);
    } else {
      return addWorkDays(today, 5);
    }
  };

  return (
    <Box sx={{ mt: 2, position: 'relative', minHeight: '57vh' }}>
      {/* Первая строка - заголовки таблицы */}
      <Grid2 container spacing={0} paddingBottom="5px" justifyContent="center">

        <Grid2 container spacing={0} size={3}>
          <Grid2
            size="auto"
            sx={[
              labelStyle,
              {
                borderRadius: '5px 0px 0px 5px',
                borderWidth: '1px 0px 1px 1px',
              }
            ]}
          >
            <Typography variant="subtitle2">Статус</Typography>
          </Grid2>
          <Grid2 size="auto">
            <TextField
              value={editedRequest.orderStateName || ''}
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{ readOnly: true }}
              disabled={disabled}
              sx={[
                textFieldStyle,
                {
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#c7c7c7',
                    },
                    borderRadius: '0px 5px 5px 0px'
                  },
                }
              ]}
            />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2
            size="auto"
            sx={[
              labelStyle,
              {
                borderRadius: '5px 0px 0px 5px',
                borderWidth: '1px 0px 1px 1px',
              }
            ]}
          >
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
                locale='ru'
                styles={{
                  ...dateInputStyle,
                  input: {
                    ...dateInputStyle.input,
                    borderRadius: '0px 5px 5px 0px',
                    '&:hover': {
                      borderColor: '#c7c7c7',
                    },

                    '&:focus': {
                      borderColor: '#c7c7c7',
                    },
                  }
                }}
                disabled={disabled}
                readOnly={true}
                value={editedRequest?.dateCreated ? dayjs(editedRequest?.dateCreated).toDate() : null}
                onChange={(newDateCreated) => handleDateChange('dateCreated', newDateCreated)}

              />
            </LocalizationProvider>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2
            size="auto"
            sx={[
              labelStyle,
              {
                borderRadius: '5px 0px 0px 5px',
                borderWidth: '1px 0px 1px 1px',
              }
            ]}
          >
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
              styles={{
                ...dateInputStyle,
                input: {
                  ...dateInputStyle.input,
                  borderRadius: '0px 5px 5px 0px'
                }
              }}
              disabled={disabled}
              readOnly={!isEditing}
              value={editedRequest?.dateFinishPlan ? dayjs(editedRequest?.dateFinishPlan).toDate() : null}
              onChange={(newDateFinishPlan) => handleDateChange('dateFinishPlan', newDateFinishPlan)}
              minDate={getMinDate()}
              excludeDate={(date) => {
                return date.getDay() === 0 || date.getDay() === 6;
              }}
            />
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2
            size="auto"
            sx={[
              labelStyle,
              {
                borderRadius: '5px 0px 0px 5px',
                borderWidth: '1px 0px 1px 1px',
              }
            ]}
          >
            <Typography variant="subtitle2">Дата решения</Typography>
          </Grid2>
          <Grid2 size="auto">
            <DateTimePicker
              placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
              valueFormat="DD.MM.YYYY HH:mm"
              withSeconds={false}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              locale='ru'
              styles={{
                ...dateInputStyle,
                input: {
                  ...dateInputStyle.input,
                  borderRadius: '0px 5px 5px 0px',
                  '&:hover': {
                    borderColor: '#c7c7c7',
                  },

                  '&:focus': {
                    borderColor: '#c7c7c7',
                  },
                }
              }}
              disabled={disabled}
              readOnly={true}
              value={editedRequest?.dateFinishFact ? dayjs(editedRequest?.dateFinishFact).toDate() : null}
              onChange={(newDateFinishFact) => handleDateChange('dateFinishFact', newDateFinishFact)}
            />
          </Grid2>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={0}>
        <Grid2 size={6}>
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '5px 0px 0px 0px',
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Сервис / Модуль</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.serviceFullname || ''}
                fullWidth
                size="small"
                variant="outlined"
                disabled={disabled}
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('itModule')}
                sx={[
                  textFieldStyle,
                  {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0px 5px 0px 0px',
                    },
                  }
                ]}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Услуга</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.catalogItemName || ''}
                fullWidth
                size="small"
                variant="outlined"
                disabled={disabled}
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('service')}
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Заголовок</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editedRequest.name || ''}
                fullWidth
                size="small"
                variant="outlined"
                disabled={disabled}
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('name')}
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Кому доступ (ЗНД)</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('accessTo')}
                disabled={(editedRequest.orderTypeName === 'ЗНД' ? false : true) || disabled}
                value={editedRequest.orderTypeName === 'ЗНД' ? initiator?.fio1c : 'Не тот тип заявки'}
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Диспетчер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <Autocomplete
                fullWidth
                size="small"
                options={users}
                value={
                  users.find((x: User) => x.idItUser === editedRequest.dispatcherId) || null
                }
                onChange={(_, newValue) => {
                  handleDispatcherChange(newValue?.idItUser || null);
                }}
                getOptionLabel={(option: User) => option.fio1c || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Не выбран"
                  />
                )}
                sx={selectInputStyle}
                disabled={disabled}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Комментарий</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextInputField
                value={editedRequest.comment || ''}
                onChange={handleChange('comment')}
                readOnly={!isEditing || disabled}
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2 size={6}>
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '5px 0px 0px 0px',
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Отложено до</Typography>
            </Grid2>
            <Grid2 size={9}>
              <DateTimePicker
                value={editedRequest?.datePostpone ? dayjs(editedRequest?.datePostpone).toDate() : null}
                placeholder="ДД.MM.ГГГГ ЧЧ:ММ"
                valueFormat="DD.MM.YYYY HH:mm"
                withSeconds={false}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                clearable
                locale='ru'
                size="md"
                styles={{
                  ...dateInputStyle,
                  input: {
                    ...dateInputStyle.input,
                    borderRadius: '0px 5px 0px 0px',
                    borderWidth: '1px 1px 0px 1px',

                  }
                }}
                disabled={disabled}
                readOnly={!isEditing}
                onChange={(newDatePostpone) => handleDateChange('datePostpone', newDatePostpone)}

                minDate={new Date()}
                excludeDate={(date) => {
                  return date.getDay() === 0 || date.getDay() === 6;
                }}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
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
                styles={{
                  ...dateInputStyle,
                  input: {
                    ...dateInputStyle.input,
                    borderWidth: '1px 1px 0px 1px',
                    '&:disabled': {
                      borderColor: ''
                    }
                  }
                }}
                disabled={(editedRequest.orderTypeName === 'ЗНТ' ? false : true) || disabled}
                readOnly={!isEditing}
                value={editedRequest?.dateTechReturn ? dayjs(editedRequest?.dateTechReturn).toDate() : null}
                onChange={(newDateTechReturn) => handleDateChange('dateTechReturn', newDateTechReturn)}

                minDate={new Date()}
                excludeDate={(date) => {
                  return date.getDay() === 0 || date.getDay() === 6;
                }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Тип заявки</Typography>
            </Grid2>
            <Grid2 size={9}>
              <FormControl fullWidth size="small" sx={selectInputStyle}>
                <Select
                  value={editedRequest.orderTypeId || ''}
                  onChange={handleOrderTypeChange}

                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = orderTypes.find((x: OrderType) => x.idOrderType === selected);
                    return p?.name;
                  }}

                  disabled={disabled}
                >
                  {orderTypes.map((item: OrderType) => (
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
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Приоритет</Typography>
            </Grid2>
            <Grid2 size={9}>
              <FormControl fullWidth size="small" sx={selectInputStyle}>
                <Select
                  value={editedRequest.orderPriorityId || ''}
                  onChange={handleOrderPriorityChange}

                  renderValue={(selected) => {
                    if (!selected) return <em>Не выбрано</em>;
                    const p = orderPriorities.find((x: OrderPriority) => x.idOrderPriority === selected);
                    return p?.name;
                  }}

                  disabled={disabled}
                >
                  {orderPriorities.map((item: OrderPriority) => (
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
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Способ обращения</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={editedRequest.orderSourceName || ''}
                rows={1}
                disabled={disabled}
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('contactMethod')}

                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>

          {/* Строка 9 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">База знаний по системе</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={1}
                disabled={disabled}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('knowledgeBase', e.target.value)}
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2 size={6}>

          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '0px 0px 0px 5px',
                  borderWidth: '1px 0px 1px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Описание</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextInputField
                value={editedRequest.description || ''}
                onChange={handleChange('description')}
                readOnly={!isEditing || disabled}
                rows={3}
                sx={multilineTextFieldStyle}
              />
            </Grid2>
          </Grid2>

        </Grid2>

        <Grid2 size={6}>
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '0px 0px 0px 5px',
                  borderWidth: '1px 0px 1px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Решение</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextInputField
                value={editedRequest.resultText || ''}
                onChange={handleChange('resultText')}
                readOnly={!isEditing || disabled}
                rows={3}
                sx={multilineTextFieldStyle}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        Информация о заявителе
      </Typography>

      <Grid2 container spacing={0}>
        <Grid2 size={6}>
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '5px 0px 0px 0px',
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Инициатор</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                disabled={true}
                value={initiator?.fio1c}
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={[
                  textFieldStyle,
                  {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0px 5px 0px 0px'
                    },
                  }
                ]}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Должность</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                disabled={true}
                value={initiator?.dolzh1c || ''}
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>
          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '0px 0px 0px 5px',
                  borderWidth: '1px 0px 1px 1px',
                }
              ]}
            >
              <Typography variant="subtitle2">Подразделение</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                disabled={true}
                value={podrInit?.name || ''}
                fullWidth
                size="small"
                variant="outlined"
                slotProps={{
                  input: {
                    readOnly: true,
                  },
                }}
                sx={[
                  textFieldStyle,
                  {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0px 0px 5px 0px',
                      '& fieldset': {
                        borderWidth: '1px',
                      },
                    },
                  }
                ]}
              />
            </Grid2>
          </Grid2>
        </Grid2>
        {/* Правая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '5px 0px 0px 0px',
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Вн. номер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                disabled={true}
                value={initiator?.telAd || ''}
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
                sx={[
                  textFieldStyle,
                  {
                    '& .MuiOutlinedInput-root': {
                      borderTopRightRadius: 5
                    },
                  }
                ]}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderWidth: '1px 0px 0px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Сот. номер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                disabled={true}
                value={initiator?.telAd || ''}
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
                sx={textFieldStyle}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2
              size={3}
              sx={[
                labelStyle,
                {
                  borderRadius: '0px 0px 0px 5px',
                  borderWidth: '1px 0px 1px 0px',
                }
              ]}
            >
              <Typography variant="subtitle2">Почта</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                disabled={true}
                value={initiator?.emailAd || ''}
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
                sx={[
                  textFieldStyle,
                  {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0px 0px 5px 0px',
                      '& fieldset': {
                        borderWidth: '1px',
                      },
                    },
                  }
                ]}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}