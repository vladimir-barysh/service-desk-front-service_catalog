import React, { useState } from 'react';
import { Grid2, TextField, Box, Typography, Button} from '@mui/material';
import { Request } from '../../../pages/support/all-support/makeData';

interface SupportGeneralFirstTabProps {
  isOpen: boolean;
  request: Request | null;
  onClose: () => void;
}

export function SupportGeneralTab({ request, onClose }: SupportGeneralFirstTabProps) {
  const [editableRequest, setEditableRequest] = useState<Request | null>(request);
  const [isEditing, setIsEditing] = useState(false);          // флаг режима редактирования

  if (!editableRequest) {
    return <Typography>Заявка не выбрана</Typography>;
  }

  const handleSave = () => {
    // Здесь будет логика сохранения изменений
    console.log('Сохранение данных:', editableRequest);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableRequest(request); // Возвращаем оригинальные данные
    setIsEditing(false);
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFieldChange = (field: keyof Request, value: string) => {
    setEditableRequest(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleCommonFieldChange = (field: string, value: string) => {
    // Для полей, которых нет в Request модели
    setEditableRequest(prev => prev ? { ...prev, [field]: value } : null);
  };

  return (
    <Box sx={{ mt: 2, position: 'relative', minHeight: '500px' }}>
      {/* Первая строка - заголовки таблицы */}
      <Grid2 container spacing={0} sx={{ border: '1px solid #e0e0e0', mb: 2 }}>
        <Grid2 size={2} sx={{ borderRight: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2">№ заявки</Typography>
        </Grid2>
        <Grid2 size={2} sx={{ borderRight: '1px solid #e0e0e0', p: 1 }}>
          <TextField
            value={editableRequest.requestNumber || ''}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{ readOnly: !isEditing }}
            onChange={(e) => handleFieldChange('requestNumber', e.target.value)}
          />
        </Grid2>
        <Grid2 size={2} sx={{ borderRight: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2">Статус</Typography>
        </Grid2>
        <Grid2 size={2} sx={{ borderRight: '1px solid #e0e0e0', p: 1 }}>
          <TextField
            value={editableRequest.status || ''}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{ readOnly: !isEditing }}
            onChange={(e) => handleFieldChange('status', e.target.value)}
          />
        </Grid2>
        <Grid2 size={2} sx={{ p: 1, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle2">Дата регистрации</Typography>
        </Grid2>
        <Grid2 size={2} sx={{ p: 1 }}>
          <TextField
            value={editableRequest.dateRegistration || ''}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{ readOnly: !isEditing }}
            onChange={(e) => handleFieldChange('dateRegistration', e.target.value)}
          />
        </Grid2>
      </Grid2>

      {/* Заголовок раздела */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        Информация о заявителе
      </Typography>

      {/* Основная таблица */}
      <Grid2 container spacing={0} sx={{ border: '1px solid #e0e0e0' }}>
        {/* Левая колонка - заголовки и значения */}
        <Grid2 size={6} sx={{ borderRight: '1px solid #e0e0e0' }}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Инициатор</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={editableRequest.initiator || 'определяется по авторизации в СД / автор письма'}
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
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Должность</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="подтягивается автоматом из АД"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Подразделение</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={'подтягивается автоматом из АД'}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Вн. номер</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="подтягивается автоматом из АД"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Сот. номер</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="подтягивается автоматом из АД"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Почта</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="подтягивается автоматом из АД"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 7 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Сервис / Модуль</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={editableRequest.itModule || 'Выбирается из каталога ИТ-услуг / может исправить специалист 1-линии поддержки'}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('itModule', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 8 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Услуга</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={editableRequest.service || 'подтягивается автоматом в зависимости от выбранного ИТ-сервиса'}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('service', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 9 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Кому доступ</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="заполняется только при подаче ЗНД при оформлении других заявок не используется"
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('accessTo', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 10 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Заголовок</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
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

          {/* Строка 11 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Описание</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="из тела письма / если заявка формируется в СД поле описание"
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('description', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 12 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Решение</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="при закрытии заявки выбрать из шаблона / написать самостоятельно оставить пустым"
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={3}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('solution', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 13 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Комментарий</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ p: 1 }}>
              <TextField
                value="Используется для пометок, видит только сотрудники УИТ"
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('comment', e.target.value)}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Правая колонка - заголовки и значения */}
        <Grid2 size={6}>
          {/* Строка 1 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Желаемый срок</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={editableRequest.dateDesired || 'не используется в ЗНД/ может быть пустым'}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('dateDesired', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 2 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Дата решения заявки</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={editableRequest.dateSolution || '12.11.24 8:30'}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleFieldChange('dateSolution', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 3 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Отложено до</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value=""
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('postponedUntil', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 4 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Описание причины отложения</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value=""
                fullWidth
                size="small"
                variant="outlined"
                multiline
                rows={2}
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('postponementReason', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 5 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Контрольная дата возврата техники</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="Устанавливается по кнопке 'Контроль возврата'"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>

          {/* Строка 6 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Тип запроса</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value={editableRequest.requestType || 'из справочника'}
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
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Приоритет</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value=""
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('priority', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 8 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Способ обращения</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value="из справочника, по умолчанию Обычный"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('contactMethod', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 9 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">База знаний по системе</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ borderBottom: '1px solid #e0e0e0', p: 1 }}>
              <TextField
                value=""
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
                onChange={(e) => handleCommonFieldChange('knowledgeBase', e.target.value)}
              />
            </Grid2>
          </Grid2>

          {/* Строка 10 */}
          <Grid2 container spacing={0}>
            <Grid2 size={3} sx={{ p: 1, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle2">Диспетчер</Typography>
            </Grid2>
            <Grid2 size={9} sx={{ p: 1 }}>
              <TextField
                value="По ссылке открывается справка по выбранному сервису"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: !isEditing }}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Кнопки внизу */}
      <Box sx={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', width: '50%' }}>
        <Grid2 container spacing={3} alignItems="center" justifyContent="flex-end">
          <Grid2 size={3}>
            <Button
              variant="contained"
              color="primary"
              size={'small'}
              fullWidth={true}
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </Button>
          </Grid2>
          <Grid2 size={3}>
            <Button
              variant="contained"
              color="inherit"
              size={'small'}
              fullWidth={true}
              onClick={isEditing ? handleCancel : onClose}
            >
              {isEditing ? 'Отмена' : 'Закрыть'}
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}