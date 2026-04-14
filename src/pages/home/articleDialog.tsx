import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid2, Box, MenuItem,
} from '@mui/material';
import {
  RichTextEditor,
  LinkBubbleMenu,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef,
} from 'mui-tiptap';
import type { EditorOptions } from '@tiptap/core';
import useExtensions from './useExtensions';
import EditorMenuControls from './EditorMenuControls';
import { Article, ArticleCategory } from '../../api/models';
import { ArticleCreateDTO } from '../../api/dtos';
import { showNotification } from '../../context';

interface ArticleDialogProps {
  open: boolean;
  editingArticle: Article | null;
  articleCategories: ArticleCategory[];
  excludedCategories: string[];
  isCreatePending: boolean;
  isUpdatePending: boolean;
  onCreateArticle: (dto: ArticleCreateDTO, options?: { onSuccess?: () => void }) => void;
  onUpdateArticle: (
    params: { id: number | undefined; data: Partial<ArticleCreateDTO> },
    options?: { onSuccess?: () => void }
  ) => void;
  onClose: () => void;
}

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) =>
    file.type.toLowerCase().startsWith('image/')
  );
}

export const ArticleDialog = ({
  open,
  editingArticle,
  articleCategories,
  excludedCategories,
  isCreatePending,
  isUpdatePending,
  onCreateArticle,
  onUpdateArticle,
  onClose,
}: ArticleDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ArticleCategory | null>(null);

  const rteRef = useRef<RichTextEditorRef>(null);
  const extensions = useExtensions({ placeholder: 'Просто начни писать :)' });
  const [isEditable] = useState(true);
  const [showMenuBar] = useState(true);

  // Заполняем форму при редактировании
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || '');
      setCategory(editingArticle.articleCategory || null);
      setContent(editingArticle.content || '');
      setTimeout(() => {
        if (rteRef.current?.editor) {
          rteRef.current.editor.commands.setContent(editingArticle.content || '');
        }
      }, 100);
    } else {
      setTitle('');
      setCategory(null);
      setContent('');
      if (rteRef.current?.editor) {
        rteRef.current.editor.commands.setContent('<p></p>');
      }
    }
  }, [editingArticle, open]);

  const handleNewImageFiles = useCallback((files: File[], insertPosition?: number) => {
    if (!rteRef.current?.editor) return;
    const attributesForImageFiles = files.map((file) => ({
      src: URL.createObjectURL(file),
      alt: file.name,
    }));
    insertImages({
      images: attributesForImageFiles,
      editor: rteRef.current.editor,
      position: insertPosition,
    });
  }, []);

  const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> = useCallback(
    (view, event, _slice, _moved) => {
      if (!(event instanceof DragEvent) || !event.dataTransfer) return false;
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

  const handlePaste: NonNullable<EditorOptions['editorProps']['handlePaste']> = useCallback(
    (_view, event, _slice) => {
      if (!event.clipboardData) return false;
      const pastedImageFiles = fileListToImageFiles(event.clipboardData.files);
      if (pastedImageFiles.length > 0) {
        handleNewImageFiles(pastedImageFiles);
        return true;
      }
      return false;
    },
    [handleNewImageFiles]
  );

  const handleEditorUpdate = () => {
    if (rteRef.current) {
      setContent(rteRef.current.editor?.getHTML() || '');
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = Number(event.target.value);
    const selectedObject = articleCategories.find((item) => item.idArticleCategory === selectedId) ?? null;
    setCategory(selectedObject);
  };

  const handleSave = () => {
    if (!title || !content || !category?.idArticleCategory) {
      showNotification({ title: 'Заполните все поля', message: '', color: 'orange' });
      return;
    }

    const dto: ArticleCreateDTO = {
      title,
      content,
      idArticleCategory: category.idArticleCategory,
    };

    if (editingArticle) {
      onUpdateArticle(
        {
          id: editingArticle.idArticle,
          data: {
            title: dto.title,
            content: dto.content,
            idArticleCategory: dto.idArticleCategory,
          },
        },
        { onSuccess: onClose }
      );
    } else {
      onCreateArticle(dto, { onSuccess: onClose });
    }
  };

  const handleDraft = () => {
    if (!title) {
      showNotification({ title: 'Введите заголовок', message: '', color: 'orange' });
      return;
    }
    const draftCat = articleCategories.find((cat) => cat.name === 'Черновики');
    const dto: ArticleCreateDTO = {
      title,
      content,
      idArticleCategory: draftCat?.idArticleCategory,
    };

    if (editingArticle) {
      onUpdateArticle(
        {
          id: editingArticle.idArticle,
          data: {
            title: dto.title,
            content: dto.content,
            idArticleCategory: dto.idArticleCategory,
          },
        },
        { onSuccess: onClose }
      );
    } else {
      onCreateArticle(dto, { onSuccess: onClose });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh', // диалог не выше 90% от высоты окна
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle>{editingArticle ? 'Редактировать статью' : 'Создать новую статью'}</DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Верхняя строка с заголовком и категорией */}
        <Grid2 container spacing={2} alignItems="center" sx={{ mb: 2, flexShrink: 0 }}>
          <Grid2 size={9}>
            <TextField
              size="small"
              autoFocus
              label="Заголовок статьи"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mt: 1 }}
            />
          </Grid2>
          <Grid2 size="auto">
            <TextField
              select
              size="small"
              
              label="Категория"
              value={category?.idArticleCategory ?? ''}
              onChange={handleCategoryChange}
              sx={{ minWidth: 250, mt: 1 }}
            >
              {articleCategories
                .filter((item): item is typeof item & { name: string } => 
                  typeof item.name === 'string' && !excludedCategories.includes(item.name)
                )
                .map((item) => (
                  <MenuItem key={item.idArticleCategory} value={item.idArticleCategory}>
                    {item.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid2>
        </Grid2>

        {/* Контейнер для редактора */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, height: '100%' }}>
          <RichTextEditor
            ref={rteRef}
            extensions={extensions}
            editable={isEditable}
            onUpdate={handleEditorUpdate}
            editorProps={{ handleDrop, handlePaste }}
            renderControls={() => <EditorMenuControls />}
            RichTextFieldProps={{
              variant: 'outlined',
              MenuBarProps: { hide: !showMenuBar },
              sx: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: '100%',
                '& .MuiInputBase-root': {
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  alignItems: 'stretch',
                  height: '100%',
                },
                '& .MuiInputBase-input': {
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                },
              },
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              minHeight: 0,
              height: '100%',
              '& .ProseMirror': {
                height: '20px',
                flexGrow: 1,
                overflow: 'auto',
                '& h1, & h2, & h3, & h4, & h5, & h6': {
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleSave}
          disabled={category?.name === 'Черновики' || isCreatePending || isUpdatePending}
        >
          Опубликовать
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleDraft}
          disabled={isCreatePending || isUpdatePending}
        >
          Черновик
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};