export type FriendType = {
  id: number;
  name: string;
  url: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
};

export type FriendForm = {
  name: string;
  url: string;
  avatar?: string;
  bio?: string;
  status: boolean;
};
