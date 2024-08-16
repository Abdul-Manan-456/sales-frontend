import { atom, selector } from "recoil";

// Define the CategoryItem interface
interface CategoryItem {
  _id: string;
  category: string;
  parentCategoryId: string[];
}

interface CategoryState {
  isLoading: boolean;
  error: string | null;
  categories: CategoryItem[];
}

// Define the atom for category state
export const categoryState = atom<CategoryState>({
  key: "categoryState",
  default: {
    isLoading: false,
    error: "",
    categories: [
      {
        _id: "1",
        category: "Electronics",
        parentCategoryId: [],
      },
    ],
  },
});

// Define the selector for category state
export const categorySelector = selector<CategoryState>({
  key: "categorySelector",
  get: ({ get }) => {
    const categories = get(categoryState);
    return categories;
  },
});

export const editCategorySelector = selector<CategoryState>({
  key: "editCategorySelector",
  get: ({ get }) => {
    const categories = get(categoryState);
    return categories;
  },
  set: ({ get, set }, item: any) => {
    const categories = get(categoryState);
    const newCategories = categories.categories.map((category) => {
      if (category._id === item._id) {
        return item;
      }
      return category;
    });

    set(categoryState, { ...categories, categories: newCategories });
  },
});
