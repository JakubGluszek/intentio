export { default } from "./IntentsWindow";

export type Sort = "asc" | "desc";

export interface Intent {
  id: string | number;
  label: string;
  pinned: boolean;
  tags: string[];
}
