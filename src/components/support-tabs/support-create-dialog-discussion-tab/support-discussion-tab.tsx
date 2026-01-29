import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { Box, Button as MUIButton, Grid2 } from "@mui/material";
import { Card, Group, Text, Textarea, ScrollArea, Divider, Anchor, Badge } from "@mantine/core";
import { IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { Order, data } from '../../../pages/support/all-support/makeData';
import { Message, seed } from './makeData';

function formatDT(iso: string) {
  const d = new Date(iso);
  const dd = d.toLocaleDateString("ru-RU");
  const tt = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return `${dd}  ${tt}`;
}

interface SupportGeneralFirstTabProps {
  request: Order | null;
}

export function SupportDiscussionTab({ request }: SupportGeneralFirstTabProps) {
  // список сообщений
  const [items, setItems] = useState<Message[]>(seed);
  // draft нового сообщения
  const [draft, setDraft] = useState("");
  // какая строка выбрана (для активации кнопки изменить)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // текущий inline-редактор
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => items.find(m => m.id === selectedId) || null, [items, selectedId]);

  useEffect(() => {
    if(request?.nomer) {
      const requestMsgs = seed.filter(
        msg => msg.idRequest === request.nomer);
      setItems(requestMsgs);
    }
    else{
      setItems([]);
    }
  }, [request?.nomer]);

  // Добавить сообщение
  const addMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const id = `${Date.now()}`;
    const next: Message = {
      id,
      author: "Христорождественская В.А.", // текущий пользователь
      createdAt: new Date().toISOString(),
      text,
      idRequest: request?.nomer,
    };
    setItems(prev => [...prev, next]);
    setDraft("");
    setTimeout(() => listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" }), 0);
  };

  // Начать редактирование
  const startEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(msg.text);
  };

  // Сохранить редактирование
  const saveEdit = () => {
    if (!editingId) return;
    const text = editText.trim();
    setItems(prev => prev.map(m => (m.id === editingId ? { ...m, text } : m)));
    setEditingId(null);
    setEditText("");
  };

  // Отменить редактирование
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // хоткеи в редакторах
  const onEditorKey = (e: React.KeyboardEvent<HTMLTextAreaElement>, mode: "add" | "edit") => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      mode === "add" ? addMessage() : saveEdit();
    } else if (e.key === "Escape" && mode === "edit") {
      e.preventDefault();
      cancelEdit();
    }
  };

  // при выборе строки — снимаем другой inline-редактор
  useEffect(() => {
    if (selectedId && editingId && selectedId !== editingId) {
      cancelEdit();
    }

  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <Box>
      <Grid2 container spacing={1} alignItems="center" justifyContent="left">
        <Grid2>
          <MUIButton
            variant="contained"
            size="small"
            startIcon={<IconEdit size={16} />}
            disabled={!selected}
            onClick={() => selected && startEdit(selected)}
          >
            Изменить сообщение
          </MUIButton>
        </Grid2>
      </Grid2>

      <Card withBorder shadow="xs" mt="xs" padding="xs">
        <ScrollArea h={300} viewportRef={listRef}>
          <div>
            {items.map((m, idx) => {
              const isEditing = editingId === m.id;
              const isSelected = selectedId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    if (selectedId !== m.id) {
                      setSelectedId(m.id);
                    }
                    else {
                      setSelectedId(null);
                    }}}
                  style={{
                    cursor: "pointer",
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: isSelected ? "rgba(33,150,243,0.08)" : "transparent",
                  }}
                >
                  <Group>
                    <Anchor component="button" onClick={() => setSelectedId(m.id)}>
                      {formatDT(m.createdAt)}
                    </Anchor>
                    <Anchor component="button" onClick={() => setSelectedId(m.id)}>
                      {m.author}
                    </Anchor>
                    <Badge variant="light" size="xs">#{idx + 1}</Badge>
                  </Group>

                  {!isEditing ? (
                    <Text mt={4} lh={1.4} style={{ whiteSpace: "pre-wrap" }}>
                      {m.text}
                    </Text>
                  ) : (
                    <div style={{ marginTop: 6 }}>
                      <Textarea
                        autosize
                        minRows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.currentTarget.value)}
                        onKeyDown={(e) => onEditorKey(e, "edit")}
                      />
                      <Group mt={6}>
                        <MUIButton
                          variant="contained"
                          size="small"
                          startIcon={<IconCheck size={16} />}
                          onClick={saveEdit}
                        >
                          Сохранить
                        </MUIButton>
                        <MUIButton
                          variant="outlined"
                          size="small"
                          startIcon={<IconX size={16} />}
                          onClick={cancelEdit}
                        >
                          Отмена
                        </MUIButton>
                        <Text size="xs" c="dimmed">
                          Ctrl+Enter — сохранить, Esc — отменить
                        </Text>
                      </Group>
                    </div>
                  )}

                  {idx < items.length - 1 && <Divider my="sm" />}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* панель ввода нового сообщения */}
        <Divider my="xs" />
        <Textarea
          id="discussion-new"
          placeholder="Напишите сообщение..."
          autosize
          minRows={2}
          value={draft}
          onChange={(e) => setDraft(e.currentTarget.value)}
          onKeyDown={(e) => onEditorKey(e, "add")}
        />
        <Group mt="xs">
          <Text size="xs" c="dimmed">
            Ctrl+Enter — отправить
          </Text>
          <MUIButton
            variant="contained"
            size="small"
            onClick={addMessage}
            disabled={!draft.trim()}
          >
            Отправить
          </MUIButton>
        </Group>
      </Card>
    </Box>
  );
}
