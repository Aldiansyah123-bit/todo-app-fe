import { v4 as uuidv4 } from 'uuid';
export const data = [
  {
    id: '1',
    title: 'Title 1',
    dec: 'Description 1',
    Due_Date: '1-Jan-2024',
  },
  {
    id: '2',
    title: 'Title 2',
    dec: 'Description 2',
    Due_Date: '2-Jan-2024',
  },
  {
    id: '3',
    title: 'Title 3',
    dec: 'Description 3',
    Due_Date: '3-Jan-2024',
  },
  {
    id: '4',
    title: 'Title 4',
    dec: 'Description 4',
    Due_Date: '4-Jan-2024',
  }
];

export const columnsFromBackend = {
  [uuidv4()]: {
    title: 'To-do',
    items: data,
  },
  [uuidv4()]: {
    title: 'In Progress',
    items: [],
  },
  [uuidv4()]: {
    title: 'Done',
    items: [],
  },
};
