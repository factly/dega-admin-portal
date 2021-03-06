import React from 'react';
import FactCheckForm from './components/FactCheckForm';
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from '../../actions/posts';
import getUserPermission from '../../utils/getUserPermission';
import FormatNotFound from '../../components/ErrorsAndImage/RecordNotFound';
import { useHistory } from 'react-router-dom';

function CreateFactCheck({ formats }) {
  const spaces = useSelector(({ spaces }) => spaces);
  const actions = getUserPermission({ resource: 'fact-checks', action: 'get', spaces });
  const history = useHistory();
  const dispatch = useDispatch();
  const onCreate = (values) => {
    dispatch(addPost(values)).then((post) => {
      if (post && post.id) history.push(`/fact-checks/${post.id}/edit`);
    });
  };

  if (!formats.loading && formats.factcheck) {
    return <FactCheckForm onCreate={onCreate} actions={actions} format={formats.factcheck} />;
  }

  return <FormatNotFound status="info" title="Fact-Check format not found" link="/formats" />;
}

export default CreateFactCheck;
