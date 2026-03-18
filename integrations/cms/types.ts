export type WixDataItem = {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
};

export type WixDataQueryResult = {
  items: WixDataItem[];
  totalCount?: number;
  hasNext: () => boolean;
};
