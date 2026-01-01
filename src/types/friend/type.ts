interface FriendType {
  id: number;
  name: string;
  url: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
}

interface FriendForm {
  name: string;
  url: string;
  avatar?: string;
  bio?: string;
  status: boolean;
}

export type { FriendType, FriendForm };
