import './CircleLoader.scss';

export function CircleLoader() {
  return (
    <div className="circle-loader">
      <svg viewBox="0 0 80 80">
        <circle id="test" cx="40" cy="40" r="32"></circle>
      </svg>
    </div>
  );
}
