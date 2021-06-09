import React from 'react';
import { Space, Button, Form, Col, Row, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import getUserPermission from '../../utils/getUserPermission';
import { useSelector, useDispatch } from 'react-redux';
import FactCheckList from '../../components/List';
import FormatNotFound from '../../components/ErrorsAndImage/RecordNotFound';
import Template from '../../components/Template';
import { getPosts } from '../../actions/posts';
import Selector from '../../components/Selector';
import deepEqual from 'deep-equal';
import { useLocation } from 'react-router-dom';

function FactCheck({ formats }) {
  const spaces = useSelector(({ spaces }) => spaces);
  const actions = getUserPermission({ resource: 'fact-checks', action: 'get', spaces });
  let query = new URLSearchParams(useLocation().search);
  const status = query.get('status');
  const { Option } = Select;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [formatFlag, setFormatFlag] = React.useState(false);
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 20,
    status: status,
  });
  query.set('page',filters.page);
  window.history.replaceState({}, '', `${window.PUBLIC_URL}${useLocation().pathname}?${query}`);
  if (!formatFlag && !formats.loading && formats.factcheck) {
    setFilters({ ...filters, format: [formats.factcheck.id] });
    setFormatFlag(true);
  }
  const { posts, total, loading, tags, categories } = useSelector((state) => {
    const node = state.posts.req.find((item) => {
      return deepEqual(item.query, filters);
    });

    if (node)
      return {
        posts: node.data.map((element) => {
          const post = state.posts.details[element];

          post.medium = state.media.details[post.featured_medium_id];
          return post;
        }),
        total: node.total,
        loading: state.posts.loading,
        tags: state.tags.details,
        categories: state.categories.details,
      };
    return { posts: [], total: 0, loading: state.posts.loading, tags: {}, categories: {} };
  });

  React.useEffect(() => {
    fetchPosts();
  }, [filters]);

  const fetchPosts = () => {
    dispatch(getPosts(filters));
  };
  const onSave = (values) => {
    let filterValue = {
      tag: values.tags,
      category: values.categories,
      sort: values.sort,
      q: values.q,
      author: values.authors,
      status: values.status !== 'all' ? values.status : null,
    };

    setFilters({ ...filters, ...filterValue });
  };
  if (!formats.loading && formats.factcheck)
    return (
      <Space direction="vertical">
        <Template format={formats.factcheck} />
        <Form
          initialValues={filters}
          form={form}
          name="filters"
          onFinish={(values) => onSave(values)}
          style={{ maxWidth: '100%' }}
          className="ant-advanced-search-form"
          onValuesChange={(changedValues, allValues) => {
            if (!changedValues.q) {
              onSave(allValues);
            }
          }}
        >
          <Row gutter={24}>
            <Col key={1}>
              <Link to="/fact-checks/create">
                <Button disabled={!(actions.includes('admin') || actions.includes('create'))}>
                  Create New
                </Button>
              </Link>
            </Col>
            <Col key={2} span={9} offset={12}>
              <Space direction="horizontal">
                <Form.Item name="q">
                  <Input placeholder="Search factchecks" />
                </Form.Item>

                <Form.Item>
                  <Button htmlType="submit">Search</Button>
                </Form.Item>
                <Form.Item name="sort" label="Sort">
                  <Select defaultValue="desc" style={{ width: '100%' }}>
                    <Option value="desc">Latest</Option>
                    <Option value="asc">Old</Option>
                  </Select>
                </Form.Item>
              </Space>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={4} key={4}>
              <Form.Item name="status" label="Status">
                <Select defaultValue="all">
                  <Option value="all">All</Option>
                  <Option value="draft">Draft</Option>
                  <Option value="publish">Publish</Option>
                  <Option value="ready">Ready to Publish</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} key={5}>
              <Form.Item name="tags" label="Tags">
                <Selector mode="multiple" action="Tags" placeholder="Filter Tags" />
              </Form.Item>
            </Col>
            <Col span={6} key={6}>
              <Form.Item name="categories" label="Categories">
                <Selector mode="multiple" action="Categories" placeholder="Filter Categories" />
              </Form.Item>
            </Col>
            <Col span={6} key={7}>
              <Form.Item name="authors" label="Authors">
                <Selector
                  mode="multiple"
                  action="Authors"
                  placeholder="Filter Authors"
                  display={'email'}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <FactCheckList
          actions={actions}
          format={formats.factcheck}
          data={{
            posts: posts,
            total: total,
            loading: loading,
            tags: tags,
            categories: categories,
          }}
          filters={filters}
          setFilters={setFilters}
          fetchPosts={fetchPosts}
        />
      </Space>
    );

  return (
    <FormatNotFound status="info" title="Fact-Check format not found" link="/formats/create" />
  );
}

export default FactCheck;
