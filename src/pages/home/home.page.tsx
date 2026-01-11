import React from 'react';
import { Grid2, Button, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { ArticleOutlined, DeleteOutlined } from '@mui/icons-material';
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getAuthorities } from '../../api/services/authorityService';

export function HomePage() {

  const {
    data: authorities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['authorities'],
    queryFn: getAuthorities,
  });

  return (
    <div>
      <Grid2 container spacing={2} direction={'row'} alignItems="left" justifyContent="left">
        <Grid2 size="auto">
          <Button
            variant="contained"
            color="success"
            startIcon={<ArticleOutlined />}
            size={'small'}
          >
            Создать статью
          </Button>
        </Grid2>
        
        <Grid2 size="auto">
          <Button
            variant="contained"
            color="warning"
            startIcon={<IconPencil />}
            size={'small'}
          >
            Редактировать статью
          </Button>
        </Grid2>

        <Grid2 size="auto">
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlined />}
            size={'small'}
          >
            Удалить статью
          </Button>
        </Grid2>
      </Grid2>
      <Typography variant="h5" gutterBottom>
        Главная страница
      </Typography>

      {/* Блок со списком полномочий */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Список полномочий (Authorities)
      </Typography>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <CircularProgress />
        </div>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Не удалось загрузить список полномочий: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {authorities.length === 0 ? (
            <Alert severity="info">
              В справочнике пока нет полномочий
            </Alert>
          ) : (
            <List>
              {authorities.map((auth: any) => (
                <ListItem key={auth.idAuthority} divider>
                  <ListItemText
                    primary={auth.authority}
                    secondary={auth.description || 'Описание отсутствует'}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </div>
  );
}