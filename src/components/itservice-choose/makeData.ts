// Тип записи каталога
export type ItSystemStatus = 'active' | 'archived' | 'decommissioned';

export interface ItSystem {
  id: string;
  name: string;     // наименование
  group: string;    // раздел каталога
  status: ItSystemStatus;
}

// Мок-данные каталога (пример)
export const systems: ItSystem[] = [
  { id: '1c',   name: '1С:Предприятие',        group: 'Прикладные системы', status: 'active' },
  { id: 'lk',   name: 'Личный кабинет',        group: 'Прикладные системы', status: 'archived' },
  { id: 'bill', name: 'Биллинговые системы',   group: 'Прикладные системы', status: 'active' },
  { id: 'orm',  name: 'ОРЭМ',                  group: 'Прикладные системы', status: 'active' },
  { id: 'tech', name: 'Технические ИТ сервисы',group: 'Технические',         status: 'active' },
  { id: 'old',  name: 'Старый CRM',            group: 'Прикладные системы', status: 'decommissioned' }, // скрыть
];
