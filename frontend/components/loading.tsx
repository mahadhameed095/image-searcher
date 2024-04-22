import Spinner from './ui/spinner'; // assuming you have a Spinner component

type LoadingProps = {
    children : React.ReactNode;
    active : boolean;
};
const Loading = ({ active, children } : LoadingProps) => {
  return (
    <>
    {active && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <Spinner />
      </div>
    )}
    <div className={`relative ${active ? 'filter blur-sm' : ''}`}>
      <div className={`${active ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
    </>
  );
};

export default Loading;
