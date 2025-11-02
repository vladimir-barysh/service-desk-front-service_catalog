import React, { useEffect, useState } from 'react';
import { Grid2 } from '@mui/material';
import { ArticleOutlined, DeleteOutlined} from '@mui/icons-material';
import Button from '@mui/material/Button';
import { IconPencil } from '@tabler/icons-react';

export function HomePage() {
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
      Главная страница
    </div>
  );
}