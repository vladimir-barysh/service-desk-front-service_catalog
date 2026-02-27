import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Paper, ListItemButton, Button, CircularProgress, Stack,
  FormControl, Select, SelectChangeEvent, MenuItem,
} from '@mui/material';
import {
  ArticleOutlined, DeleteOutlined,
  Favorite, FavoriteBorder,
  Comment, Share,
  Star, Event, Lock, LockOpen, TextFields
} from '@mui/icons-material';
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getAuthorities } from '../../api/services/authorityService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  RichTextReadOnly,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef,
} from 'mui-tiptap';
import type { EditorOptions } from "@tiptap/core";
import useExtensions from './useExtensions';
import EditorMenuControls from './EditorMenuControls';
import { getArticles, createArticle } from '../../api/services/articleService';
import { getArticleCategories } from '../../api/services/articleCategoryService';
import { ArticleCreateDTO } from '../../api/dtos';
import { Article, ArticleCategory } from '../../api/models';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { formatFIO } from '../../components';
import { useUpdateArticle } from '../../api/hooks/useUpdateArticle';
interface Article1 {
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

function fileListToImageFiles(fileList: FileList): File[] {
  // You may want to use a package like attr-accept
  // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
  // types.
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}

export function HomePage() {

  const [articles1, setArticles] = useState<Article1[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditinArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<Article>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = React.useState<ArticleCategory | null>(null);
  const [categoryName, setCategoryName] = useState<string | ''>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const CurrUser = 'Ананьев Александр Александрович';

  const categories = ['Все', 'Новости', 'Технические работы', 'Мои статьи', 'Архив', 'Черновики'];
  const excludedCategories = ['Архив', 'Черновики'];

  const rteRef = useRef<RichTextEditorRef>(null);
  const extensions = useExtensions({
    placeholder: "Add your own content here...",
  });
  const [isEditable, setIsEditable] = useState(true);
  const [showMenuBar, setShowMenuBar] = useState(true);

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
    enabled: true,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
  const {
    data: articlecategories = [],
    isLoading: isloadingCat,
    error: errorCat,
  } = useQuery({
    queryKey: ['articlecategories'],
    queryFn: getArticleCategories,
    enabled: true,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation<any, AxiosError, ArticleCreateDTO>({
    mutationFn: createArticle,
    onSuccess: (newArticle) => {
      notifications.show({
        title: 'Успешно',
        message: 'Статья создана',
        color: 'green',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.green[6],
            borderColor: theme.colors.green[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.green[6] },
          },
        }),
      });

      queryClient.invalidateQueries({ queryKey: ['articles'] });

      handleClose();
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Ошибка',
        message: error?.response?.data?.message || error.message || 'Не удалось создать статью',
        color: 'red',
        autoClose: 4000,
        withCloseButton: true,
        withBorder: false,
        loading: false,
        styles: (theme) => ({
          root: {
            backgroundColor: theme.colors.red[6],
            borderColor: theme.colors.red[6],
          },
          title: { color: theme.white },
          description: { color: theme.white },
          closeButton: {
            color: theme.white,
            '&:hover': { backgroundColor: theme.colors.red[8] },
          },
        }),
      });
    },
  });

  const filteredData = useMemo(() => {
    let result = articles;

    result = [...result].sort((a, b) => {
      const dateA = dayjs(a.dateCreated);
      const dateB = dayjs(b.dateCreated);
      return dateB.valueOf() - dateA.valueOf();
    });

    if (selectedCategory === 'Новости') {
      result = result.filter((article: Article) => article.articleCategory?.name === 'Новости');
    }
    else if (selectedCategory === 'Технические работы') {
      result = result.filter((article: Article) => article.articleCategory?.name === 'Технические работы');
    }
    else if (selectedCategory === 'Мои статьи') {
      result = result.filter((article: Article) => article.userCreator?.fio1c === CurrUser);
    }
    else if (selectedCategory === 'Архив') {
      result = result.filter((article: Article) => article.articleCategory?.name === 'Архив');
    }
    else if (selectedCategory === 'Черновики') {
      result = result.filter((article: Article) => article.articleCategory?.name === 'Черновики' && article.userCreator?.fio1c === CurrUser);
    }
    else {
      result = result.filter((article: Article) => article.articleCategory?.name !== 'Черновики' && article.articleCategory?.name !== 'Архив');
    }

    return result;
  }, [articles, selectedCategory]);

  const handleOpenCreateDialog = () => {
    setEditinArticle(null);
    setTitle('');
    setCategory(null);
    setContent('');
    if (rteRef.current?.editor) {
      rteRef.current.editor.commands.setContent('<p></p>');
    }

    setOpenDialog(true);
  }

  const handleOpenEditDialog = (article: Article) => {
    setEditinArticle(article);
    setTitle(article?.title || '');
    setCategory(article?.articleCategory || null);
    setContent(article?.content || '');
    setTimeout(() => {
      if (rteRef.current?.editor) {
        rteRef.current.editor.commands.setContent(article?.content || '');
      }
    }, 100);
    setOpenDialog(true);
  }

  const handleClose = () => {
    setTitle('');
    setCategory(null);
    setCategoryName('');
    setContent('');
    setOpenDialog(false);
  };

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      // For the sake of a demo, we don't have a server to upload the files to,
      // so we'll instead convert each one to a local "temporary" object URL.
      // This will not persist properly in a production setting. You should
      // instead upload the image files to your server, or perhaps convert the
      // images to bas64 if you would like to encode the image data directly
      // into the editor content, though that can make the editor content very
      // large. You will probably want to use the same upload function here as
      // for the MenuButtonImageUpload `onUploadFiles` prop.
      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      });
    },
    []
  );

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event, _slice, _moved) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);

          // Return true to treat the event as handled. We call preventDefault
          // ourselves for good measure.
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  // Allow for pasting images
  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
      (_view, event, _slice) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files
        );
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);
          // Return true to mark the paste event as handled. This can for
          // instance prevent redundant copies of the same image showing up,
          // like if you right-click and copy an image from within the editor
          // (in which case it will be added to the clipboard both as a file and
          // as HTML, which Tiptap would otherwise separately parse.)
          return true;
        }

        // We return false here to allow the standard paste-handler to run.
        return false;
      },
      [handleNewImageFiles]
    );

  const [submittedContent, setSubmittedContent] = useState("");

  // Загрузка статей при монтировании
  useEffect(() => {
    const mockArticles: Article1[] = [
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
    //setFilteredArticles(mockArticles);
  }, []);

  const { mutate: updateArticleMutate, isPending } = useUpdateArticle();

  const handleCreateArticle = async () => {
    if (!title || !content || !category?.idArticleCategory) {
      setSnackbar({
        open: true,
        message: 'Заполните все поля',
        severity: 'error'
      });
      return;
    }

    const dto: ArticleCreateDTO = {
      title: title,
      content: content,
      idArticleCategory: category?.idArticleCategory
    }

    if (editingArticle) {
      updateArticleMutate(
        {
          id: editingArticle?.idArticle,
          data: {
            title: dto?.title,
            content: dto?.content,
            idArticleCategory: dto.idArticleCategory
          },
        },
      );
    } else {
      mutation.mutate(dto);
    }

    handleClose();
    setSnackbar({ open: true, message: 'Статья успешно создана', severity: 'success' });
  };

  const handleDraftArticle = () => {
    if (!title) {
      setSnackbar({
        open: true,
        message: 'Введите заголовок',
        severity: 'error'
      });
      return;
    }
    const draftCat = articlecategories.find((cat: ArticleCategory) => cat.name === 'Черновики');
    const dto: ArticleCreateDTO = {
      title: title,
      content: content,
      idArticleCategory: draftCat?.idArticleCategory
    }

    if (editingArticle) {
      updateArticleMutate(
        {
          id: editingArticle?.idArticle,
          data: {
            title: dto?.title,
            content: dto?.content,
            idArticleCategory: dto.idArticleCategory
          },
        },
      );
    } else {
      mutation.mutate(dto);
    }

    handleClose();
    setSnackbar({ open: true, message: 'Статья помещена в черновик', severity: 'success' });
  };

  const handleDeleteArticle = (article: Article | undefined) => {
    const newCat = articlecategories.find((cat: ArticleCategory) => cat.name === 'Архив');
    updateArticleMutate(
      {
        id: article?.idArticle,
        data: {
          title: article?.title,
          content: article?.content,
          idArticleCategory: newCat.idArticleCategory
        },
      },
    );

    setSnackbar({ open: true, message: 'Статья удалена', severity: 'success' });
  };

  const handleLike = (id: number) => {
    setArticles(articles.map((article: any) =>
      article.id === id
        ? {
          ...article,
          likes: article.isLiked ? article.likes - 1 : article.likes + 1,
          isLiked: !article.isLiked
        }
        : article
    ));
  };

  const featuredArticles = articles.filter((article: any) => article.isFeatured);

  const handleEditorUpdate = () => {
    if (rteRef.current) {
      const html = rteRef.current.editor?.getHTML();
      setContent(html || '');
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);

    const selectedObject = articlecategories.find(
      (item: any) => item.idArticleCategory === selectedId
    ) ?? null;
    setCategory(selectedObject);
    setCategoryName(selectedObject.name);
    console.log('Category: ', selectedObject)
  };

  return (
    <div>
      <Grid2 container spacing={3}>

        <Grid2 size={{ xs: 12, md: 2 }}>

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
                  <ListItemText primary={category}
                    primaryTypographyProps={{
                      fontSize: '1.0rem',
                    }} />
                </ListItemButton>
              ))}

            </List>

          </Paper>

        </Grid2>

        <Grid2 size={{ xs: 12, md: 7 }}>

          <Grid2 container spacing={2} alignItems="center" justifyContent="center" sx={{}}>

            {/*
            <Grid2 size="auto">
              <Button
                variant="contained"
                color="warning"
                startIcon={<IconPencil />}
                size={'medium'}
              >
                Редактировать статью
              </Button>
            </Grid2>

            <Grid2 size="auto">
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteOutlined />}
                size={'medium'}
              >
                Удалить статью
              </Button>
            </Grid2>*/}
          </Grid2>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {filteredData.map((article: Article) => (
              <Card key={article.idArticle} elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ pb: 1 }}>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {article.userCreator?.fio1c?.split(' ').map((n: any) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2" fontWeight="bold">
                        {article.title}
                        {/*article.isFeatured && (
                          <Star color="warning" sx={{ ml: 1, fontSize: 18 }} />
                        )*/}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatFIO(article.userCreator?.fio1c || '')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          • {dayjs(article.dateCreated).format('DD.MM.YYYY HH:mm')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Chip
                    label={article.articleCategory?.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />

                  <RichTextReadOnly
                    content={article.content}
                    extensions={extensions}
                  />

                </CardContent>

                {article.userCreator?.fio1c === CurrUser && article?.articleCategory?.name !== 'Архив' && (

                  <CardActions sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                      <Box sx={{ flexGrow: 1 }} />

                      <Button
                        size="small"
                        startIcon={<IconPencil />}
                        sx={{ color: 'text.secondary' }}
                        onClick={() => handleOpenEditDialog(article)}
                      >
                        Редактировать
                      </Button>


                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlined />}
                        onClick={() => handleDeleteArticle(article)}
                      >
                        Удалить
                      </Button>

                    </Box>
                  </CardActions>

                )}
              </Card>
            ))}
          </Box>

        </Grid2>

        <Grid2 size={{ xs: 12, md: 3 }}>

          <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Button
              variant="contained"
              color='primary'
              startIcon={<ArticleOutlined />}
              size={'medium'}
              fullWidth
              onClick={handleOpenCreateDialog}
            >
              Создать статью
            </Button>
          </Paper>

          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <Star color="warning" sx={{ mr: 1, fontSize: 20 }} />
              Избранные статьи
            </Typography>
            <List dense>
              {featuredArticles.map((article: any) => (
                <ListItemButton
                  key={article.id}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText
                    primary={article.title}
                    secondary={format(article.date, 'dd.MM.yyyy')}
                    primaryTypographyProps={{ fontSize: '1.0rem' }}
                    secondaryTypographyProps={{ fontSize: '0.85rem' }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>

        </Grid2>
      </Grid2>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingArticle ? 'Редактировать статью' : 'Создать новую статью'}
        </DialogTitle>

        <DialogContent sx={{ minHeight: '500px' }}>
          <TextField
            autoFocus
            margin="dense"
            label="Заголовок статьи"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid2
            container
            size={6}
            spacing={2}
            direction={'column'}
            alignItems="left"
            justifyContent="left"
            margin="0px 0px 0px 0px"
          >
            <Grid2 size="auto">
              <Typography>Категория</Typography>
            </Grid2>
            <Grid2 size="auto">
              <FormControl fullWidth size="small">
                <Select
                  value={category?.idArticleCategory ?? ''}
                  onChange={handleCategoryChange}
                  renderValue={(category) => {
                    if (!category) return <em>Не выбрано</em>;
                    const ac = articlecategories.find((x: any) => x.idArticleCategory === category);
                    return ac?.name;
                  }}
                >
                  {articlecategories
                    .filter((item: any) => !excludedCategories.includes(item.name))
                    .map((item: any) => (
                      <MenuItem key={item.idArticleCategory} value={item.idArticleCategory}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>

          <RichTextEditor
            ref={rteRef}
            extensions={extensions}
            editable={isEditable}
            onUpdate={handleEditorUpdate}
            editorProps={{
              handleDrop: handleDrop,
              handlePaste: handlePaste,
            }}
            renderControls={() => <EditorMenuControls />}

            RichTextFieldProps={{
              // The "outlined" variant is the default (shown here only as
              // example), but can be changed to "standard" to remove the outlined
              // field border from the editor
              variant: "outlined",
              MenuBarProps: {
                hide: !showMenuBar,
              },
              // Below is an example of adding a toggle within the outlined field
              // for showing/hiding the editor menu bar, and a "submit" button for
              // saving/viewing the HTML content

            }}
            sx={{
              // An example of how editor styles can be overridden. In this case,
              // setting where the scroll anchors to when jumping to headings. The
              // scroll margin isn't built in since it will likely vary depending on
              // where the editor itself is rendered (e.g. if there's a sticky nav
              // bar on your site).
              "& .ProseMirror": {
                "& h1, & h2, & h3, & h4, & h5, & h6": {
                  scrollMarginTop: showMenuBar ? 50 : 0,
                },
              },
            }}
          >
            {() => (
              <>
                <LinkBubbleMenu />
                <TableBubbleMenu />
              </>
            )}
          </RichTextEditor>

        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>

          <Button
            variant="contained"
            color="success"
            onClick={handleCreateArticle}
            disabled={category?.name === 'Черновики'}
          >
            Опубликовать
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={handleDraftArticle}
          >
            Черновик
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClose}
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div >
  );
}