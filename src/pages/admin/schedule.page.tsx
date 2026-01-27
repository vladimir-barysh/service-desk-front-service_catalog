import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// -------------------- Типы --------------------

type AbsenceType = "vacation" | "sick" | "trip" | "remote";

type Absence = {
  id: number;
  fullName: string;
  department: string;
  type: AbsenceType;
  dateFrom: string;
  dateTo: string;
};

// -------------------- Моковые данные --------------------

const MOCK_DATA: Absence[] = [
  {
    id: 1,
    fullName: "Иванов И.И.",
    department: "IT",
    type: "vacation",
    dateFrom: "2026-01-20",
    dateTo: "2026-01-30",
  },
  {
    id: 2,
    fullName: "Петров П.П.",
    department: "HR",
    type: "sick",
    dateFrom: "2026-01-22",
    dateTo: "2026-01-25",
  },
  {
    id: 3,
    fullName: "Сидоров С.С.",
    department: "Sales",
    type: "trip",
    dateFrom: "2026-01-18",
    dateTo: "2026-01-28",
  },
  {
    id: 4,
    fullName: "Кузнецова А.А.",
    department: "IT",
    type: "remote",
    dateFrom: "2026-01-15",
    dateTo: "2026-02-01",
  },
];

// -------------------- Вспомогательные функции --------------------

function typeLabel(type: AbsenceType) {
  switch (type) {
    case "vacation":
      return "Отпуск";
    case "sick":
      return "Больничный";
    case "trip":
      return "Командировка";
    case "remote":
      return "Удалёнка";
  }
}

// -------------------- Основной компонент --------------------

export function SchedulePage() {
  const [department, setDepartment] = React.useState("");
  const [type, setType] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  // Фильтрация
  const filtered = React.useMemo(() => {
    return MOCK_DATA.filter((a) => {
      if (department && a.department !== department) return false;
      if (type && a.type !== type) return false;
      if (dateFrom && a.dateFrom < dateFrom) return false;
      if (dateTo && a.dateTo > dateTo) return false;
      return true;
    });
  }, [department, type, dateFrom, dateTo]);

  // KPI
  const totalAbsent = filtered.length;
  const vacationCount = filtered.filter((a) => a.type === "vacation").length;
  const sickCount = filtered.filter((a) => a.type === "sick").length;

  // Агрегация для графиков
  const byType = [
    { id: 0, value: vacationCount, label: "Отпуск" },
    { id: 1, value: sickCount, label: "Больничный" },
    {
      id: 2,
      value: filtered.filter((a) => a.type === "trip").length,
      label: "Командировка",
    },
    {
      id: 3,
      value: filtered.filter((a) => a.type === "remote").length,
      label: "Удалёнка",
    },
  ];

  const departments = ["IT", "HR", "Sales"];
  const byDepartment = departments.map(
    (dep) => filtered.filter((a) => a.department === dep).length
  );

  // Колонки таблицы
  const columns: GridColDef[] = [
    { field: "fullName", headerName: "ФИО", flex: 1 },
    { field: "department", headerName: "Отдел", flex: 1 },
    {
      field: "type",
      headerName: "Тип",
      flex: 1,
      valueGetter: (v) => typeLabel(v),
    },
    { field: "dateFrom", headerName: "С", flex: 1 },
    { field: "dateTo", headerName: "По", flex: 1 },
  ];

  // -------------------- UI --------------------

  return (
    <Stack spacing={3} padding={3}>
      <Typography variant="h4">
        Учёт отсутствия сотрудников
      </Typography>

      {/* Фильтры */}
      <Box display="flex" gap={2}>
        <TextField
          select
          label="Отдел"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
        </TextField>

        <TextField
          select
          label="Тип"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Все</MenuItem>
          <MenuItem value="vacation">Отпуск</MenuItem>
          <MenuItem value="sick">Больничный</MenuItem>
          <MenuItem value="trip">Командировка</MenuItem>
          <MenuItem value="remote">Удалёнка</MenuItem>
        </TextField>

        <TextField
          type="date"
          label="С"
          InputLabelProps={{ shrink: true }}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <TextField
          type="date"
          label="По"
          InputLabelProps={{ shrink: true }}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </Box>

      {/* KPI */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Отсутствуют сейчас
              </Typography>
              <Typography variant="h4">
                {totalAbsent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                В отпуске
              </Typography>
              <Typography variant="h4">
                {vacationCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                На больничном
              </Typography>
              <Typography variant="h4">
                {sickCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Таблица */}
      <div style={{ height: 400 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </Stack>
  );
}
