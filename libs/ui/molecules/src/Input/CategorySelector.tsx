import { Tag } from '@okampus/ui/atoms';
import { useEffect, useState } from 'react';

// TODO: add swiper for overflowing categories

type Category = string;

export type CategorySelectorProps<T> = {
  items: T[];
  showCount?: boolean;
  itemToCategories?: (item: T) => Category[];
  selectedCategories?: Category[];
  onChangeCategories?: (selectedCategories: Category[]) => void;
  onChangeFilteredItems?: (filteredItems: T[]) => void;
};

function getFilteredItems<T>(items: T[], selectedCategories: Category[], itemToCategory: (item: T) => Category[]) {
  const filteredItems: T[] = [];
  for (const item of items) {
    const categories = itemToCategory(item);
    if (selectedCategories.every((category) => categories.includes(category))) {
      filteredItems.push(item);
    }
  }
  return filteredItems;
}

function getCategories<T>(items: T[], itemToCategory: (item: T) => Category[], selected: Category[]) {
  const categoriesCounts: { [key: Category]: number } = {};
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
  showCount = false,
  itemToCategories = (item: T) => [item.toString()],
  onChangeCategories = () => ({}),
  onChangeFilteredItems = () => ({}),
}: CategorySelectorProps<T>) {
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [categories, setCategories] = useState<[Category, number][]>([]);

  useEffect(() => {
    onChangeCategories(selectedCategory);
    const currentFilteredItems =
      selectedCategory.length === 0 ? items : getFilteredItems(items, selectedCategory, itemToCategories);
    onChangeFilteredItems(currentFilteredItems);
    setCategories(getCategories(currentFilteredItems, itemToCategories, selectedCategory));
  }, [selectedCategory]);

  const toggleCategory = (category: Category) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((c) => c !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  return (
    <div className="flex gap-2">
      {categories.map(([category, count]) => (
        <Tag
          key={category}
          label={category}
          className={'cursor-pointer bg-2-hover'}
          backgroundClass={selectedCategory.includes(category) ? 'bg-0 bg-3-hover' : 'bg-4'}
          onClick={() => toggleCategory(category)}
          {...(showCount ? { count } : {})}
        />
      ))}
    </div>
  );
}
