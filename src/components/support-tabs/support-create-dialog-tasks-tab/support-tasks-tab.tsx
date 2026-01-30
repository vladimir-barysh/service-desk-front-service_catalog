import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { SchemaNode, schemaData } from './makeData';
import { RedirectTaskDialog, RedirectData, PostponeTaskDialog, PostponeData } from '../../../components';
import { Order } from '../../../pages/support/all-support/makeData';

// Пропсы для компонентов
interface BlockSchemaProps {
  data: SchemaNode[];
  selectedNode: SchemaNode | null;
  onNodeSelect: (node: SchemaNode | null) => void;
}

interface SupportTasksTabProps {
  request: Order | null;
}

// Функция для блок схемы
const BlockSchema = ({ data, selectedNode, onNodeSelect }: BlockSchemaProps) => {
  // Рекурсивная функция отрисовки узлов
  const renderNode = (node: SchemaNode, level = 0) => {
    const indent = level * 100;
    const isSelected = selectedNode?.id === node.id;
    
    return (
      <Box key={node.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2}}>
        {/* Блок */}
        <Paper 
          sx={{ 
            p: 1, 
            minWidth: 200, 
            textAlign: 'center', 
            backgroundColor: isSelected ? 'primary.light' : 'primary.main', 
            color: 'white', 
            mb: 2, 
            ml: `${indent}px`,
            cursor: 'pointer',
            border: '2px solid #1976d2',
            '&:hover': {
              backgroundColor: isSelected ? 'none' : 'primary.dark',
            }
          }}
          onClick={() => {
            // Если блок уже выбран, снимаем выделение, иначе выбираем
            if (isSelected) {
              onNodeSelect(null);
            } else {
              onNodeSelect(node);
            }
          }}
        >
          <Typography variant="body2">
            {node.title}
          </Typography>
        </Paper>

        {/* Дочерние элементы */}
        {node.children && (
          <Box>
            {node.children.map(child => renderNode(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      {data.map(node => renderNode(node))}
    </Box>
  );
};

// Основная функция
export function SupportTasksTab({ request }: SupportTasksTabProps) {
  // Состояния компонентов
  const [selectedNode, setSelectedNode] = useState<SchemaNode | null>(null);
  const [redirectDialogOpen, setRedirectDialogOpen] = useState(false);
  const [postponeDialogOpen, setPostponeDialogOpen] = useState(false);

  const handleNodeSelect = (node: SchemaNode | null) => {
    setSelectedNode(node);
  };

  const handleRedirectClick = () => {
    if (selectedNode) {
      setRedirectDialogOpen(true);
    }
  };

  const handlePostponeClick = () => {
    setPostponeDialogOpen(true);
  };

  const handleRedirectSave = (data: RedirectData) => {
    console.log('Данные перенаправления:', data);
    setRedirectDialogOpen(false);
  };

  const handlePostponeSave = (data: PostponeData) => {
    console.log('Данные откладывания:', data);
    // Здесь обновляем request с новой датой
    if (request) {
      // request.postponeDate = data.postponeUntil; // Раскомментировать когда добавите поле в Request
    }
    setPostponeDialogOpen(false);
  };

  const handleRedirectClose = () => {
    setRedirectDialogOpen(false);
  };

  const handlePostponeClose = () => {
    setPostponeDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Верхние кнопки действий */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary" size="small" sx={{ flex: '1 1 auto', minWidth: '120px' }}>
          Создать задачу
        </Button>
        <Button variant="contained" color="inherit" size="small" sx={{ flex: '1 1 auto', minWidth: '120px' }}>
          Создать подзадачу
        </Button>
        <Button 
          variant="contained" 
          color="inherit" 
          size="small" 
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
          onClick={handleRedirectClick}
          disabled={!selectedNode}
        >
          Перенаправить задачу
        </Button>
        <Button 
          variant="contained" 
          color="warning" 
          size="small" 
          sx={{ flex: '1 1 auto', minWidth: '120px' }}
          onClick={handlePostponeClick}
        >
          Отложить задачу
        </Button>
        <Button variant="contained" color="success" size="small" sx={{ flex: '1 1 auto', minWidth: '120px' }}>
          Закрыть задачу
        </Button>
      </Box>

      {/* Блок-схема */}
      <BlockSchema 
        data={schemaData} 
        selectedNode={selectedNode}
        onNodeSelect={handleNodeSelect}
      />

      {/* Диалог перенаправления задачи */}
      <RedirectTaskDialog
        open={redirectDialogOpen}
        onClose={handleRedirectClose}
        onSave={handleRedirectSave}
        currentExecutor={selectedNode?.title || ''}
      />

      {/* Диалог откладывания задачи */}
      <PostponeTaskDialog
        open={postponeDialogOpen}
        onClose={handlePostponeClose}
        onSave={handlePostponeSave}
        //currentDate={request?.dateFinishPlan} // Передаем текущую дату из request
      />

      {/* Вывод выбранного блока */}
      {selectedNode && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Выбран: {selectedNode.title}
        </Typography>
      )}
    </Box>
  );
}