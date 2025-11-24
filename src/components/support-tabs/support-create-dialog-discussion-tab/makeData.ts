export type Message = {
  id: string;
  author: string;
  createdAt: string;
  text: string;
  
};

export const seed: Message[] = [
  {
    id: "m1",
    author: "Петров Петр Петрович",
    createdAt: "2024-11-05T08:30:00+03:00",
    text: "Прошу уточнить ....",
  },
  {
    id: "m2",
    author: "Иванов Иван Иванович",
    createdAt: "2024-11-05T10:30:00+03:00",
    text: "уточняю...",
  },
];