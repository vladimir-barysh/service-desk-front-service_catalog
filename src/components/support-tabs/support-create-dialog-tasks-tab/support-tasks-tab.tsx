import React, {useRef} from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';

export function SupportTasksTab() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Верхние кнопки действий */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 3,
        flexWrap: 'wrap'
      }}>
        <Button 
          variant="contained"
          color="primary" 
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
        > Создать задачу </Button>
        <Button 
          variant="contained"
          color="inherit" 
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
        > Создать подзадачу </Button>
        <Button 
          variant="contained"
          color="inherit"
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
        > Перенаправить задачу </Button>
        <Button 
          variant="contained"
          color="warning" 
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
        > Отложить задачу </Button>
        <Button 
          variant="contained"
          color="success" 
          size="small"
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
        > Закрыть задачу </Button>
      </Box>

      {/* Блок-схема */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
        {/* Задача диспетчера */}
        <Paper sx={{ p: 1, minWidth: 200, textAlign: 'center', backgroundColor: 'primary.main', color: 'white'}}>
          <Typography variant="body2">Задача диспетчера</Typography>
        </Paper>

          {/* Стрелка от Задача диспетчера до Исполнитель 2 */}
  <Box sx={{
    position: 'absolute',
    top: '40px', // отступ от верха Задача диспетчера
    left: '100px', // начальная позиция стрелки
    width: '2px',
    height: '80px', // высота стрелки
    backgroundColor: 'grey.400',
    zIndex: 1
  }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2  , ml: '100px'}}>
          {/* Исполнитель 1 */}
          <Paper sx={{ p: 1, minWidth: 200, textAlign: 'center', backgroundColor: 'primary.main', color: 'white'}}>
            <Typography variant="body2">Исполнитель 1</Typography>
          </Paper>
          

          {/* Исполнитель 2 */}
          <Paper sx={{ p: 1, minWidth: 200, textAlign: 'center', backgroundColor: 'primary.main', color: 'white'}}>
            <Typography variant="body2">Исполнитель 2</Typography>
          </Paper>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2  , ml: '100px'}}>
            {/* Исполнитель 3 */}
            <Paper sx={{ p: 1, minWidth: 200, textAlign: 'center', backgroundColor: 'primary.main', color: 'white'}}>
              <Typography variant="body2">Исполнитель 3</Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}