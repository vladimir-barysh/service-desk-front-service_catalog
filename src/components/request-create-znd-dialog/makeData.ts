export class rolesDataClass {
    roleName?: string;
    roleDescription?: string
    id?: number;
}

export const roles: rolesDataClass[] = [
    {
        'roleName': 'Администратор',
        'roleDescription': 'Полные права доступа',
        'id': 1,
    },
    {
        'roleName': 'Пользователь',
        'roleDescription': 'Ограниченные права доступа ',
        'id': 2,
    },
]