import { useState, useMemo } from 'react';
import {
  Grid2, Card, CardContent, CardActions,
  Typography, Avatar, Chip, Box,
  List, ListItemText, Paper, ListItemButton, Button,
} from '@mui/material';
import { ArticleOutlined, DeleteOutlined, Star } from '@mui/icons-material';
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getArticleCategories } from '../../api/services/articleCategoryService';
import { Article, ArticleCategory } from '../../api/models';
import dayjs from 'dayjs';
import { formatFIO } from '../../components';
import { getArticles } from '../../api/services/articleService';
import { useUpdateArticle, useCreateArticle } from '../../api';
import { showNotification } from '../../context';
import { ArticleDialog } from './articleDialog';
import { RichTextReadOnly } from 'mui-tiptap';
import useExtensions from './useExtensions';

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const CurrUser = 'Ананьев Александр Александрович';
  const categories = ['Все', 'Новости', 'Технические работы', 'Мои статьи', 'Архив', 'Черновики'];
  const excludedCategories = ['Архив', 'Черновики'];

  const extensions = useExtensions({ placeholder: 'Read-only content' });

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { data: articlecategories = [] } = useQuery({
    queryKey: ['articlecategories'],
    queryFn: getArticleCategories,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { mutate: createArticleMutation, isPending: isCreatePending } = useCreateArticle();
  const { mutate: updateArticleMutation, isPending: isUpdatePending } = useUpdateArticle();

  const filteredData = useMemo(() => {
    const result = [...articles].sort((a, b) => dayjs(b.dateCreated).valueOf() - dayjs(a.dateCreated).valueOf());

    switch (selectedCategory) {
      case 'Новости':
        return result.filter(a => a.articleCategory?.name === 'Новости');
      case 'Технические работы':
        return result.filter(a => a.articleCategory?.name === 'Технические работы');
      case 'Мои статьи':
        return result.filter(a => a.userCreator?.fio1c === CurrUser);
      case 'Архив':
        return result.filter(a => a.articleCategory?.name === 'Архив');
      case 'Черновики':
        return result.filter(a => a.articleCategory?.name === 'Черновики' && a.userCreator?.fio1c === CurrUser);
      default:
        return result.filter(a => a.articleCategory?.name !== 'Черновики' && a.articleCategory?.name !== 'Архив');
    }
  }, [articles, selectedCategory]);

  const handleOpenCreateDialog = () => {
    setEditingArticle(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (article: Article) => {
    setEditingArticle(article);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (article: Article | undefined) => {
    const archiveCat = articlecategories.find((cat: ArticleCategory) => cat.name === 'Архив');
    if (!archiveCat) {
      showNotification({ title: 'Ошибка', message: 'Категория "Архив" не найдена', color: 'red' });
      return;
    }
    updateArticleMutation({
      id: article?.idArticle,
      data: {
        title: article?.title,
        content: article?.content,
        idArticleCategory: archiveCat.idArticleCategory,
      },
    });
  };

  return (
    <div>
      <Grid2 container spacing={3}>
        {/* Левая панель категорий */}
        <Grid2 size={{ xs: 12, md: 2 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Категории статей
            </Typography>
            <List dense>
              {categories.map(cat => (
                <ListItemButton
                  key={cat}
                  selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': { backgroundColor: 'primary.dark' }
                    }
                  }}
                >
                  <ListItemText primary={cat} primaryTypographyProps={{ fontSize: '1.0rem' }} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid2>

        {/* Центральный список статей */}
        <Grid2 size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredData.map(article => (
              <Card key={article.idArticle} elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {article.userCreator?.fio1c?.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">{article.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatFIO(article.userCreator?.fio1c || '')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {dayjs(article.dateCreated).format('DD.MM.YYYY HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Chip label={article.articleCategory?.name} size="small" color="primary" variant="outlined" sx={{ mb: 2 }} />
                  <RichTextReadOnly content={article.content} extensions={extensions} />
                </CardContent>
                {article.userCreator?.fio1c === CurrUser && article.articleCategory?.name !== 'Архив' && (
                  <CardActions sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ flexGrow: 1 }} />
                    <Button size="small" startIcon={<IconPencil />} sx={{ color: 'text.secondary' }} onClick={() => handleOpenEditDialog(article)}>
                      Редактировать
                    </Button>
                    <Button size="small" color="error" startIcon={<DeleteOutlined />} onClick={() => handleDeleteArticle(article)}>
                      Удалить
                    </Button>
                  </CardActions>
                )}
              </Card>
            ))}
          </Box>
        </Grid2>

        {/* Правая панель */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Button variant="contained" color="primary" startIcon={<ArticleOutlined />} fullWidth onClick={handleOpenCreateDialog}>
              Создать статью
            </Button>
          </Paper>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              <Star color="warning" sx={{ mr: 1, fontSize: 20 }} /> Избранные статьи
            </Typography>
            <List dense>{/* Здесь можно добавить реальные избранные статьи */}</List>
          </Paper>
        </Grid2>
      </Grid2>

      <ArticleDialog
        open={openDialog}
        editingArticle={editingArticle}
        articleCategories={articlecategories}
        excludedCategories={excludedCategories}
        isCreatePending={isCreatePending}
        isUpdatePending={isUpdatePending}
        onCreateArticle={createArticleMutation}
        onUpdateArticle={updateArticleMutation}
        onClose={handleCloseDialog}
      />
    </div>
  );
}