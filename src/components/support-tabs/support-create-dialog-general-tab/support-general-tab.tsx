import React, { useState} from 'react';
import { Grid2, TextField, Box, Typography, Button} from '@mui/material';
import { DateTimePicker } from '@mantine/dates';
import { Request } from '../../../pages/support/all-support/makeData';

interface SupportGeneralFirstTabProps {
  isOpen: boolean;
  request: Request | null;
}

export function SupportGeneralTab({ request}: SupportGeneralFirstTabProps) {
  const [editableRequest, setEditableRequest] = useState<Request | null>(request);
  const isEditing = useState(true);                    // флаг режима редактирования
  const [hasChanges, setHasChanges] = useState(false); // флаг наличия изменений

  if (!editableRequest) {
    return <Typography>Заявка не выбрана</Typography>;
  }

  const handleSave = () => {
    // Здесь будет логика сохранения изменений
    console.log('Сохранение данных:', editableRequest);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setEditableRequest(request); // Возвращаем оригинальные данные
    setHasChanges(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditableRequest(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  return (
    <Box sx={{ mt: 2, position: 'relative', minHeight: '500px' }}>
      {/* Первая строка - заголовки таблицы */}
      <Grid2 container spacing={0} sx={{ mb: 1 }}>
        <Grid2 size={1} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2">№ заявки</Typography>
        </Grid2>
        <Grid2 size={1}>
          <TextField
            value={editableRequest.requestNumber || ''}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{ readOnly: !isEditing }}
            onChange={(e) => handleFieldChange('requestNumber', e.target.value)}
          />
        </Grid2>
        <Grid2 size={1} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2">Статус</Typography>
        </Grid2>
        <Grid2 size={2}>
          <TextField
            value={editableRequest.status || ''}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{ readOnly: !isEditing }}
            onChange={(e) => handleFieldChange('status', e.target.value)}
          />
        </Grid2>
        <Grid2 size={2} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2">Дата регистрации</Typography>
        </Grid2>
        <Grid2 size={2}>
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
          />
        </Grid2>

        {/* Кнопки */}
        <Grid2 size={3} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!hasChanges}
            onClick={handleSave}
            sx={{ minWidth: '100px' }}
          >
            Сохранить
          </Button>
          <Button
            variant="contained"
            color="inherit"
            size="small"
            disabled={!hasChanges}
            onClick={handleCancel}
            sx={{ minWidth: '100px' }}
          >
            Отмена
          </Button>
        </Grid2>
      </Grid2>

      {/* Основная таблица */}
      <Grid2 container spacing={0}>
        {/* Левая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Сервис / Модуль</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editableRequest.itModule || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('itModule', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Услуга</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editableRequest.service || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('service', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Кому доступ</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('accessTo', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Заголовок</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editableRequest.header || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('header', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Описание</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Решение</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('solution', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 7 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Комментарий</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('comment', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 8 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Диспетчер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Правая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Желаемый срок</Typography>
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
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Дата решения</Typography>
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
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
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
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Описание причины отложения</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('postponementReason', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
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
            />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Тип запроса</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editableRequest.requestType || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('requestType', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 7 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Приоритет</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 8 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
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
                onChange={(e) => handleFieldChange('contactMethod', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 9 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
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
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Инициатор</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                value={editableRequest.initiator || ''}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('initiator', e.target.value)}
              />
            </Grid2>
          </Grid2>
          
          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Должность</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>
          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Подразделение</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>
        </Grid2>
        {/* Правая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Вн. номер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Сот. номер</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ border: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Почта</Typography>
            </Grid2>
            <Grid2 size={9}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}