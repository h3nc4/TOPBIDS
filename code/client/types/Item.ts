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
  delete: number[];
  update: ItemUpdate[];
  add: Item[];
}

export type { Item, UpdateResponse, ItemUpdate};
