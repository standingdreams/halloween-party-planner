import { GooeyCircleLoader } from 'react-loaders-kit';

export function Loader({ loading }: { loading: boolean }) {
  const loaderProps = {
    loading,
    size: 135,
    duration: 1,
    colors: ['#A47FDB', '#ee5622', '#eca72c'],
  };

  return <GooeyCircleLoader {...loaderProps} />;
}
