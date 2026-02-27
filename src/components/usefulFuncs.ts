export const formatFIO = (fullName: string): string => {
    if (!fullName) return '';

    const parts = fullName.trim().split(' ');
    if (parts.length < 2) return fullName;

    const lastName = parts[0];
    const firstName = parts[1]?.charAt(0).toUpperCase() || '';
    const middleName = parts[2]?.charAt(0).toUpperCase() || '';

    return `${lastName} ${firstName}.${middleName ? middleName + '.' : ''}`;
  };