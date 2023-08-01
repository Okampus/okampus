import TagBadge from '../../atoms/Badge/TagBadge';
import { useEffect, useState } from 'react';

// TODO: add swiper for overflowing categories

export type CategorySelectorProps<T> = {
  items: T[];
  showCount?: boolean;
  itemToCategories?: (item: T) => string[];
  selectedCategories?: string[];
  onChangeCategories?: (selectedCategories: string[]) => void;
  onChangeFilteredItems?: (filteredItems: T[]) => void;
};

function getFilteredItems<T>(items: T[], selectedCategories: string[], itemToCategory: (item: T) => string[]) {
  const filteredItems: T[] = [];
  for (const item of items) {
    const categories = itemToCategory(item);
    if (selectedCategories.every((category) => categories.includes(category))) {
      filteredItems.push(item);
    }
  }
  return filteredItems;
}

function getCategories<T>(items: T[], itemToCategory: (item: T) => string[], selected: string[]) {
  const categoriesCounts: { [key: string]: number } = {};
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

export default function CategorySelector<T extends object>({
  items,
  showCount = false,
  itemToCategories = (item: T) => [item.toString()],
  onChangeCategories = () => ({}),
  onChangeFilteredItems = () => ({}),
}: CategorySelectorProps<T>) {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [categories, setCategories] = useState<[string, number][]>([]);

  useEffect(() => {
    onChangeCategories(selectedCategory);
    const currentFilteredItems =
      selectedCategory.length === 0 ? items : getFilteredItems(items, selectedCategory, itemToCategories);
    onChangeFilteredItems(currentFilteredItems);
    setCategories(getCategories(currentFilteredItems, itemToCategories, selectedCategory));
  }, [selectedCategory]);

  const toggleCategory = (category: string) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.filter((c) => c !== category));
    } else {
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  return (
    <div className="flex gap-2">
      {categories.map(([category, count]) => (
        <TagBadge
          key={category}
          label={category}
          className={'cursor-pointer bg-1-hover'}
          backgroundClass={selectedCategory.includes(category) ? 'bg-0 bg-3-hover' : 'bg-4'}
          onClick={() => toggleCategory(category)}
          {...(showCount ? { count } : {})}
        />
      ))}
    </div>
  );
}
