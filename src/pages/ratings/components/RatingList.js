import React from 'react';
import { Popconfirm, Button, Table } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { getRatings, deleteRating } from '../../../actions/ratings';
import { Link, useLocation } from 'react-router-dom';
import deepEqual from 'deep-equal';

function RatingList({ actions }) {
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const [filters, setFilters] = React.useState({
    page: 1,
    limit: 20,
  });
  query.set('page',filters.page);
  window.history.replaceState({}, '', `${window.PUBLIC_URL}${useLocation().pathname}?${query}`);
  const { ratings, total, loading } = useSelector((state) => {
    const node = state.ratings.req.find((item) => {
      return deepEqual(item.query, filters);
    });

    if (node)
      return {
        ratings: node.data.map((element) => state.ratings.details[element]),
        total: node.total,
        loading: state.ratings.loading,
      };
    return { ratings: [], total: 0, loading: state.ratings.loading };
  });

  React.useEffect(() => {
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchRatings = () => {
    dispatch(getRatings(filters));
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Rating Value', dataIndex: 'numeric_value', key: 'numeric_value' },
    {
      title: 'Preview',
      dataIndex: 'preview',
      render: (_, record) => (
        <div
          style={{
            color: record.text_colour?.hex,
            backgroundColor: record.background_colour?.hex,
            width: '100px',
            border: '1px solid black',
            padding: '0.5rem',
            textAlign: 'center',
          }}
        >
          {record.name}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) => {
        return (
          <span>
            <Link
              className="ant-dropdown-link"
              style={{
                marginRight: 8,
              }}
              to={`/ratings/${record.id}/edit`}
            >
              <Button disabled={!(actions.includes('admin') || actions.includes('update'))}>
                Edit
              </Button>
            </Link>
            <Popconfirm
              title="Sure to Delete?"
              onConfirm={() => dispatch(deleteRating(record.id)).then(() => fetchRatings())}
            >
              <Link to="" className="ant-dropdown-link">
                <Button disabled={!(actions.includes('admin') || actions.includes('delete'))}>
                  Delete
                </Button>
              </Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <Table
      bordered
      columns={columns}
      dataSource={ratings}
      loading={loading}
      rowKey={'id'}
      pagination={{
        total: total,
        current: filters.page,
        pageSize: filters.limit,
        onChange: (pageNumber, pageSize) => setFilters({ page: pageNumber, limit: pageSize }),
      }}
    />
  );
}

export default RatingList;
