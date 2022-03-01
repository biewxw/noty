export interface Block {
  id: string;
  content: string;
}

export interface Page {
  id: string;
  title: string;
  blocks: Block[];
}