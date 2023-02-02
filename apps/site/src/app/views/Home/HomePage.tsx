import './searchbar.scss';

export function HomePage() {
  return (
    <div className="w-full bg-gradient rounded-lg h-60 flex flex-col items-center gap-4">
      <div className="mt-8 text-3xl font-medium text-white">Bonsoir Ivan !</div>
      <div className="px-6 text-2 w-[40rem] h-12 bg-3 rounded-lg home-searchbar items-center flex shadow-lg gap-1.5">
        <div></div>
        <div>Retrouve</div>
      </div>
    </div>
  );
}
