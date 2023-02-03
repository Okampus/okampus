import { ReactComponent as SearchIcon } from '@okampus/assets/svg/icons/search.svg';

export function Searchbar() {
  return (
    <div className="px-3 py-1.5 text-0 bg-2 text-sm rounded-lg flex gap-2 cursor-text">
      <SearchIcon height="20" className="flex-shrink-0 text-1" />
      <input type="text" className="focus:outline-none bg-transparent" placeholder="Find anything" />
    </div>
  );
}
