import React, {useState, useEffect} from 'react';
import { 
  Grid2, Card, 
  CardContent, CardActions, 
  Typography, Avatar,
  Chip, Box,
  Dialog, DialogTitle,
  DialogContent, DialogActions,
  TextField, Snackbar,
  Alert, List,
  ListItem, ListItemAvatar,
  ListItemText, Badge,
  Paper, ListItemButton, Button, CircularProgress
} from '@mui/material';
import { 
  ArticleOutlined, DeleteOutlined, 
  Favorite, FavoriteBorder,
  Comment, Share,
  Star, Event
} from '@mui/icons-material';
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getAuthorities } from '../../api/services/authorityService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  category: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isFeatured?: boolean;
}

interface OnlineUser {
  id: number;
  name: string;
  position: string;
  isOnline: boolean;
}

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: 'event' | 'deadline';
}

export function HomePage() {

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [openDialog, setOpenDialog] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: '', content: '', category: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Категории для фильтрации
  const categories = ['Все', 'Новости', 'Инструкции', 'Важные объявления', 'Техподдержка'];

  // Онлайн-сотрудники
  const [onlineUsers] = useState<OnlineUser[]>([
    { id: 1, name: 'Алексей Петров', position: 'Системный администратор', isOnline: true },
    { id: 2, name: 'Мария Сидорова', position: 'Frontend разработчик', isOnline: true },
    { id: 3, name: 'Иван Козлов', position: 'Backend разработчик', isOnline: true },
    { id: 4, name: 'Елена Новикова', position: 'Тестировщик', isOnline: false },
    { id: 5, name: 'Дмитрий Волков', position: 'Team Lead', isOnline: true }
  ]);

  // Календарь событий
  const [calendarEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'Обновление серверов', date: new Date(2024, 0, 20), type: 'event' },
    { id: 2, title: 'Сдача проекта CRM', date: new Date(2024, 0, 25), type: 'deadline' },
    { id: 3, title: 'Техническое совещание', date: new Date(2024, 0, 18), type: 'event' },
    { id: 4, title: 'Обновление документации', date: new Date(2024, 0, 22), type: 'deadline' }
  ]);

  // Загрузка статей при монтировании
  useEffect(() => {
    const mockArticles: Article[] = [
      {
        id: 1,
        title: 'Обновление системы документооборота',
        content: 'Уважаемые коллеги! Сообщаем о плановом обновлении системы электронного документооборота, которое запланировано на ближайшие выходные.',
        author: 'Алексей Петров',
        date: new Date(2024, 0, 15),
        category: 'Новости',
        likes: 12,
        comments: 5,
        isLiked: false,
        isFeatured: true
      },
      {
        id: 2,
        title: 'Инструкция по работе с новым CRM',
        content: 'Разработана подробная инструкция по работе с обновленной CRM-системой. Все сотрудники могут ознакомиться с материалами в разделе "База знаний".',
        author: 'Мария Сидорова',
        date: new Date(2024, 0, 10),
        category: 'Инструкции',
        likes: 8,
        comments: 3,
        isLiked: true,
        isFeatured: true
      },
      {
        id: 3,
        title: 'Плановые работы на сервере',
        content: 'В ночь с 20 на 21 января будут проводиться плановые работы на основном сервере. Возможны кратковременные перебои в работе.',
        author: 'Иван Козлов',
        date: new Date(2024, 0, 12),
        category: 'Важные объявления',
        likes: 15,
        comments: 7,
        isLiked: false
      },
      {
        id: 4,
        title: 'Решение проблемы с почтой',
        content: 'Обнаружена и исправлена проблема с отправкой писем через корпоративную почту. Все системы работают в штатном режиме.',
        author: 'Алексей Петров',
        date: new Date(2024, 0, 8),
        category: 'Техподдержка',
        likes: 6,
        comments: 2,
        isLiked: false
      }
    ];
    setArticles(mockArticles);
    setFilteredArticles(mockArticles);
  }, []);

  // Фильтрация статей по категории
  useEffect(() => {
    if (selectedCategory === 'Все') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === selectedCategory));
    }
  }, [selectedCategory, articles]);

  const handleCreateArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      setSnackbar({ open: true, message: 'Заполните обязательные поля', severity: 'error' });
      return;
    }

    const article: Article = {
      id: Date.now(),
      title: newArticle.title,
      content: newArticle.content,
      author: 'Иван Иванов',
      date: new Date(),
      category: newArticle.category || 'Общее',
      likes: 0,
      comments: 0,
      isLiked: false
    };

    setArticles([article, ...articles]);
    setNewArticle({ title: '', content: '', category: '' });
    setOpenDialog(false);
    setSnackbar({ open: true, message: 'Статья успешно создана', severity: 'success' });
  };

  const handleLike = (id: number) => {
    setArticles(articles.map(article => 
      article.id === id 
        ? { 
            ...article, 
            likes: article.isLiked ? article.likes - 1 : article.likes + 1,
            isLiked: !article.isLiked 
          }
        : article
    ));
  };

  const handleDeleteArticle = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
    setSnackbar({ open: true, message: 'Статья удалена', severity: 'success' });
  };

  const featuredArticles = articles.filter(article => article.isFeatured);

  const {
    data: authorities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['authorities'],
    queryFn: getAuthorities,
  });

  return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <Grid2 container spacing={3}>
        {/* Левая панель - Категории и Избранное */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Категории статей
            </Typography>
            <List dense>
              {categories.map((category) => (
                <ListItemButton
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemText primary={category} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <Star color="warning" sx={{ mr: 1, fontSize: 20 }} />
              Избранные статьи
            </Typography>
            <List dense>
              {featuredArticles.map((article) => (
                <ListItemButton  
                  key={article.id}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText 
                    primary={article.title}
                    secondary={format(article.date, 'dd.MM.yyyy')}
                    primaryTypographyProps={{ fontSize: '0.9rem' }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid2>

        {/* Центральная часть - Лента статей */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          {/* Панель управления */}
          <Grid2 container spacing={2} alignItems="center" justifyContent="left" sx={{ mb: 4 }}>
            <Grid2 size="auto">
              <Button
                variant="contained"
                color="success"
                startIcon={<ArticleOutlined />}
                size={'small'}
                onClick={() => setOpenDialog(true)}
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

          {/* Лента статей */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredArticles.map((article) => (
              <Card key={article.id} elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ pb: 1 }}>
                  {/* Заголовок и мета-информация */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {article.author.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2" fontWeight="bold">
                        {article.title}
                        {article.isFeatured && (
                          <Star color="warning" sx={{ ml: 1, fontSize: 18 }} />
                        )}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {article.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {format(article.date, 'dd MMMM yyyy', { locale: ru })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Категория */}
                  <Chip 
                    label={article.category} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  {/* Содержание статьи */}
                  <Typography variant="body1" paragraph>
                    {article.content}
                  </Typography>
                </CardContent>

                {/* Статистика и действия */}
                <CardActions sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                    <Button 
                      size="small" 
                      startIcon={article.isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                      onClick={() => handleLike(article.id)}
                      sx={{ color: 'text.secondary' }}
                    >
                      {article.likes}
                    </Button>
                    
                    <Button 
                      size="small" 
                      startIcon={<Comment />}
                      sx={{ color: 'text.secondary' }}
                    >
                      {article.comments}
                    </Button>
                    
                    <Button 
                      size="small" 
                      startIcon={<Share />}
                      sx={{ color: 'text.secondary' }}
                    >
                      Поделиться
                    </Button>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteOutlined />}
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      Удалить
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Grid2>

        {/* Правая панель - Онлайн сотрудники и Календарь */}
        <Grid2 size={{ xs: 12, md: 3 }}>
          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Сейчас онлайн ({onlineUsers.filter(u => u.isOnline).length})
            </Typography>
            <List dense>
              {onlineUsers.filter(user => user.isOnline).map((user) => (
                <ListItem key={user.id} sx={{ px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Badge
                      color="success"
                      variant="dot"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={user.name}
                    secondary={user.position}
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 'medium' }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <Event color="primary" sx={{ mr: 1, fontSize: 20 }} />
              Календарь событий
            </Typography>
            <List dense>
              {calendarEvents.map((event) => (
                <ListItem key={event.id} sx={{ px: 0 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: event.type === 'deadline' ? 'error.main' : 'primary.main',
                      fontSize: '0.8rem'
                    }}>
                      {format(event.date, 'dd')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={event.title}
                    secondary={format(event.date, 'dd MMMM', { locale: ru })}
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      color: event.type === 'deadline' ? 'error.main' : 'text.primary'
                    }}
                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid2>
      </Grid2>

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

      {/* Диалог создания статьи */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Создать новую статью</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Заголовок статьи"
            fullWidth
            variant="outlined"
            value={newArticle.title}
            onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Категория"
            fullWidth
            variant="outlined"
            value={newArticle.category}
            onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Содержание статьи"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={newArticle.content}
            onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateArticle} variant="contained" color="success">
            Опубликовать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}