import { Handler } from '@netlify/functions';

const dummyData: any[] = [
  { id: 1, complete: false, todo: 'Clippers on beard' },
  { id: 2, complete: false, todo: 'Shave' },
  { id: 3, complete: false, todo: 'Find shirt' },
  { id: 4, complete: false, todo: 'Clean/Sort Trousers/Outfit for tomorrow' },
  { id: 5, complete: false, todo: 'Pack bag for tomorrow' },
];

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: dummyData,
    }),
  };
};
