export const formatFIO = (fullName: string): string => {
  if (!fullName) return '';

  const parts = fullName.trim().split(' ');
  if (parts.length < 2) return fullName;

  const lastName = parts[0];
  const firstName = parts[1]?.charAt(0).toUpperCase() || '';
  const middleName = parts[2]?.charAt(0).toUpperCase() || '';

  return `${lastName} ${firstName}.${middleName ? middleName + '.' : ''}`;
};


/*
  Константы состояний заявки/задачи
*/
export const TASK_STATES = {
  RENEWED: 'Возобновлена',
  PENDING: 'В ожидании',
  IN_WORK: 'В работе',
  CLOSED: 'Закрыта',
  PENDING_CONFIRMATION: 'На подтверждении',
  UNDER_CONSIDERATION: 'На рассмотрении',
  PENDING_APPROVAL: 'На согласовании',
  PENDING_AFFIRMATION: 'На утверждении',
  NOT_APPROVED: 'Не согласовано',
  NEW: 'Новая',
  REJECTED: 'Отклонена',
  CANCELLED_BY_INITIATOR: 'Отменена инициатором',
  APPROVED: 'Согласовано',
  APPROVAL_REJECTED: 'Согласование отклонено',
  APPROVAL_CANCELLED: 'Согласование отменено',
  AFFIRMED: 'Утверждено'
} as const;