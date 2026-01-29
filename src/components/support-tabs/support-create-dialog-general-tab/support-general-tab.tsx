import React, { useState, useEffect, useRef} from 'react';
import { Grid2, TextField, 
  Box, Typography, 
  Button, InputLabel,
  MenuItem, FormControl,
  Select, InputAdornment
} from '@mui/material';
import { DateTimePicker } from '@mantine/dates';
import { Order } from '../../../pages/support/all-support/makeData';
import { PhoneOutlined, AlternateEmail } from '@mui/icons-material';
import { TextInputField } from '../../text-input-field';

interface SupportGeneralTabProps {
  isOpen: boolean;
  request: Order | null;
  onUpdate?: (data: any, hasChanges: boolean) => void;
}

export function SupportGeneralTab({ request, onUpdate }: SupportGeneralTabProps) {
  const [editedRequest, setEditableRequest] = useState<Order | null>(request);
  const isEditing = !editedRequest?.orderState?.name?.includes('Закрыта');              // флаг режима редактирования
  const hasChanges = JSON.stringify(editedRequest) !== JSON.stringify(request);                      // флаг наличия изменений

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
    setEditableRequest(request); // Возвращаем оригинальные данные
    //setHasChanges(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditableRequest(prev => prev ? { ...prev, [field]: value } : null);
    //setHasChanges(true);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onUpdate){
      onUpdate(editedRequest, hasChanges);
    }
    
  }, [editedRequest, hasChanges, onUpdate]);

  const handleChange = (field: string) => (event: any) => {
    const value = event.target.value;
    setEditableRequest(prev => prev ? { ...prev, [field]: value } : null);
  };
  
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
                  value={editedRequest.orderState?.name || ''}
                  onChange={handleChange('status')}
                >
                  {/*Добавить недостающие статусы*/}
                  <MenuItem value={"Новая"}>Новая</MenuItem>
                  <MenuItem value={"Закрытая"}>Закрытая</MenuItem>
                  <MenuItem value={"В работе"}>В работе</MenuItem>
                  <MenuItem value={"Согласование отколнено"}>Согласование отколнено</MenuItem>
                </Select>
              </FormControl>
          </Grid2>
        </Grid2>

        <Grid2 container spacing={0} size={3}>
          <Grid2 size="auto" sx={labelStyle}>
            <Typography variant="subtitle2">Дата регистрации</Typography>
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
              styles={{ input: {minHeight: '40px'}}}
              readOnly={!isEditing}
              //В заявке даты - строка, тут - DateValue
              //value={editedRequest.dateCreated}
              //onChange={handleChange('dateRegistration')}
            />
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
                styles={{ input: {minHeight: '40px'}}}
                readOnly={!isEditing}
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
                styles={{ input: {minHeight: '40px'}}}
                readOnly={!isEditing}
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
                onChange={handleChange('header')}
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
                onChange={handleChange('solution')}
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
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('dispatcher')}
                value={editedRequest.dispatcher?.fio1c || ''}
              />
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
                styles={{ input: {minHeight: '40px'}}}
                readOnly={!isEditing}
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}
          

          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Контрольная дата возврата техники</Typography>
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
              styles={{ input: {minHeight: '40px'}}}
              readOnly={!isEditing}
            />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={labelStyle}>
              <Typography variant="subtitle2">Тип заявки</Typography>
            </Grid2>
            <Grid2 size={9}>
              <FormControl fullWidth>
                <Select
                  value={editedRequest.orderType?.name || ''}
                  onChange={handleChange('requestType')}
                >
                  <MenuItem value={"ЗНО"}>ЗНО</MenuItem>
                  <MenuItem value={"ЗНД"}>ЗНД</MenuItem>
                  <MenuItem value={"ЗНИ"}>ЗНИ</MenuItem>
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
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={handleChange('priority')}
                value={editedRequest.orderPriority?.name || ''}
              />
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
                rows={2}
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
                rows={2}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('knowledgeBase', e.target.value)}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Заголовок раздела */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold'}}>
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