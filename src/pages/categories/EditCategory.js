import React from 'react';
import CategoryEditForm from './components/CategoryForm';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { updateCategory, getCategory } from '../../actions/categories';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import RecordNotFound from '../../components/ErrorsAndImage/RecordNotFound';

function EditCategory() {
  const history = useHistory();
  const { id } = useParams();

  const dispatch = useDispatch();

  const { category, loading } = useSelector((state) => {
    return {
      category: state.categories.details[id] ? state.categories.details[id] : null,
      loading: state.categories.loading,
    };
  });

  React.useEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);

  //if (loading) return <Skeleton />;

  if (!category) {
    return <RecordNotFound />;
  }

  const onUpdate = (values) => {
    dispatch(updateCategory({ ...category, ...values })).then(() =>
      history.push(`/categories/${id}/edit`),
    );
  };
  if (category) return <CategoryEditForm data={category} onCreate={onUpdate} />;
}

export default EditCategory;
