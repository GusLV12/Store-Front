import { useParams } from 'react-router-dom';

export const EditProducts = () => {

  const { id } = useParams();
  return (

    <div>EditProducts {id}</div>
  );
};
