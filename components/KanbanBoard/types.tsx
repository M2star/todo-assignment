export type id = string | number;

export type Columns = {
  id: id;
  title: string;
};

export type Tasks = {
  completed: Boolean ;
  id: number | string;
  title: string;
  userId: number | string;
  status?: string;
  order?: number;
  description?:string;
};
