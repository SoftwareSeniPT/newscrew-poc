import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default Loadable({
  loader: () => import('./index'),
  loading: Loading,
});
