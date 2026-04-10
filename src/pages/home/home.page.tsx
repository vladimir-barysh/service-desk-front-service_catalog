import { useState, useRef, useCallback, useMemo } from 'react';
import * as React from 'react';
import {
  Grid2, Card,
  CardContent, CardActions,
  Typography, Avatar,
  Chip, Box,
  Dialog, DialogTitle,
  DialogContent, DialogActions,
  TextField, List,
  ListItemText,
  Paper, ListItemButton, Button,
  FormControl, Select, SelectChangeEvent, MenuItem,
} from '@mui/material';
import {
  ArticleOutlined, DeleteOutlined, Star
} from '@mui/icons-material';
import { IconPencil } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  LinkBubbleMenu,
  RichTextEditor,
  RichTextReadOnly,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef,
} from 'mui-tiptap';
import type { EditorOptions } from "@tiptap/core";
import useExtensions from './useExtensions';
import EditorMenuControls from './EditorMenuControls';
import { getArticleCategories } from '../../api/services/articleCategoryService';
import { ArticleCreateDTO } from '../../api/dtos';
import { Article, ArticleCategory } from '../../api/models';
import dayjs from 'dayjs';
import { formatFIO } from '../../components';
import { getArticles } from '../../api/services/articleService';
import { useUpdateArticle, useCreateArticle } from '../../api';
import { showNotification } from '../../context';

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditinArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = React.useState<ArticleCategory | null>(null);
  const [categoryName, setCategoryName] = useState<string | ''>('');
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

  const { mutate: createArticleMutation, isPending: isCreatePending } = useCreateArticle();
  const { mutate: updateArticleMutation, isPending: isUpdatePending } = useUpdateArticle();

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
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  // Вставка изображений
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
          return true;
        }
        return false;
      },
      [handleNewImageFiles]
    );

  const handleCreateArticle = async () => {
    if (!title || !content || !category?.idArticleCategory) {
      showNotification({ title: 'Заполните все поля', message: '', color: 'orange' });
      return;
    }

    const dto: ArticleCreateDTO = {
      title: title,
      content: content,
      idArticleCategory: category.idArticleCategory,
    };

    if (editingArticle) {
      updateArticleMutation(
        {
          id: editingArticle.idArticle,
          data: {
            title: dto.title,
            content: dto.content,
            idArticleCategory: dto.idArticleCategory,
          },
        },
        { onSuccess: () => handleClose() }
      );
    } else {
      createArticleMutation(dto, { onSuccess: () => handleClose() });
    }
  };

  const handleDraftArticle = () => {
    if (!title) {
      showNotification({ title: 'Введите заголовок', message: '', color: 'orange' });
      return;
    }
    const draftCat = articlecategories.find((cat: ArticleCategory) => cat.name === 'Черновики');
    const dto: ArticleCreateDTO = {
      title: title,
      content: content,
      idArticleCategory: draftCat?.idArticleCategory,
    };

    if (editingArticle) {
      updateArticleMutation(
        {
          id: editingArticle.idArticle,
          data: {
            title: dto.title,
            content: dto.content,
            idArticleCategory: dto.idArticleCategory,
          },
        },
        { onSuccess: () => handleClose() }
      );
    } else {
      createArticleMutation(dto, { onSuccess: () => handleClose() });
    }
  };

  const handleDeleteArticle = (article: Article | undefined) => {
    const newCat = articlecategories.find((cat: ArticleCategory) => cat.name === 'Архив');
    if (!newCat) {
      showNotification({ title: 'Ошибка', message: 'Категория "Архив" не найдена', color: 'red' });
      return;
    }
    updateArticleMutation(
      {
        id: article?.idArticle,
        data: {
          title: article?.title,
          content: article?.content,
          idArticleCategory: newCat.idArticleCategory,
        },
      },
      {
        onSuccess: () => {
          showNotification({ title: 'Ошибка', message: 'Категория "Архив" не найдена', color: 'red' });
        }
      }
    );
  }


/*  *
    * Логика избранных статей и лайка статьи
    *
    
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
  const featuredArticles = articles.filter((article: any) => article.isFeatured); */


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

            {/* *
                * Отображение избранных статей
                *

              { {featuredArticles.map((article: any) => (
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
              ))} } */}

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
              variant: "outlined",
              MenuBarProps: {
                hide: !showMenuBar,
              },
            }}
            sx={{
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
            disabled={category?.name === 'Черновики' || isCreatePending || isUpdatePending}
          >
            Опубликовать
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={handleDraftArticle}
            disabled={isCreatePending || isUpdatePending}
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
    </div >
  );
}