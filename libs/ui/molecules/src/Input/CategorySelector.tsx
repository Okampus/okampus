import { useEffect, useState } from 'react';

// TODO: add swiper for overflowing categories

type Category = string;

export type CategorySelectorProps<T> = {
  items: T[];
  itemToCategories?: (item: T) => Category[];
  selectedCategories?: Category[];
  onChangeCategories?: (selectedCategories: Category[]) => void;
  onChangeFilteredItems?: (filteredItems: T[]) => void;
};

function getFilteredItems<T>(items: T[], selectedCategories: Category[], itemToCategory: (item: T) => Category[]) {
  const filteredItems = [] as T[];
  for (const item of items) {
    const categories = itemToCategory(item);
    if (selectedCategories.every((category) => categories.includes(category))) {
      filteredItems.push(item);
    }
  }
  return filteredItems;
}

function getCategories<T>(items: T[], itemToCategory: (item: T) => Category[], selected: Category[]) {
  const categoriesCounts = {} as { [key: Category]: number };
  for (const item of items) {
    const categories = itemToCategory(item);
    for (const category of categories) {
      if (categoriesCounts[category]) {
        categoriesCounts[category]++;
      } else {
        categoriesCounts[category] = 1;
      }
    }
  }

  // Prioritize selected categories
  return Object.entries(categoriesCounts).sort((a, b) => b[1] - a[1] + (selected.includes(b[0]) ? 1000 : 0));
}

export function CategorySelector<T extends object>({
  items,
  itemToCategories = (item: T) => [item.toString()],
  onChangeCategories = () => ({}),
  onChangeFilteredItems = () => ({}),
}: CategorySelectorProps<T>) {
  const [selected, setSelected] = useState<Category[]>([]);
  const [categories, setCategories] = useState<[Category, number][]>([]);

  useEffect(() => {
    onChangeCategories(selected);
    const currentFilteredItems = selected.length === 0 ? items : getFilteredItems(items, selected, itemToCategories);
    onChangeFilteredItems(currentFilteredItems);
    setCategories(getCategories(currentFilteredItems, itemToCategories, selected));
  }, [selected]);

  const toggleCategory = (category: Category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((c) => c !== category));
    } else {
      setSelected([...selected, category]);
    }
  };

  return (
    <div className="flex gap-2">
      {categories.map(([category, count]) => (
        <div
          key={category}
          className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer ${
            selected.includes(category) ? 'bg-gray-500' : 'hover:bg-gray-500 bg-gray-800'
          }`}
          onClick={() => toggleCategory(category)}
        >
          <div className="text-0 text-base font-heading">{category}</div>
          <div className="text-3 text-base font-heading">{count}</div>
        </div>
      ))}
    </div>
  );
}
