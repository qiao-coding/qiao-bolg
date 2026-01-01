interface miscellaneousType {
    id: number;
    content: string;
    date: string;
}
 interface Miscellaneous {
  id: number;
  content: string;
  date: string;
}

interface MiscellaneousSearchParams {
  q: string;
}

export type { miscellaneousType , Miscellaneous , MiscellaneousSearchParams }