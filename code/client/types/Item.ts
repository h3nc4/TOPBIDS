interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    vendor: string;
    date: string;
    image: string;
}

interface ItemUpdate {
  id: number;
  date: string;
}

interface UpdateResponse {
  delete: Array<number>;
  update: Array<ItemUpdate>;
  add: Array<Item>;
}

export type { Item, UpdateResponse, ItemUpdate};
