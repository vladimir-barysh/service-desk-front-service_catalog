// Тип для узла схемы
export interface SchemaNode {
  id: string;
  title: string;
  children?: SchemaNode[];
}

// Данные для блок-схемы
export const schemaData: SchemaNode[] = [
  {
    id: '1',
    title: 'Задача диспетчера',
    children: [
      {
        id: '2',
        title: 'Исполнитель 1',
      },
      {
        id: '3', 
        title: 'Исполнитель 2',
        children: [
          {
            id: '4',
            title: 'Исполнитель 3',
          }
        ]
      }
    ]
  }
];