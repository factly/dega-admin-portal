import axios from 'axios';
import {
  ADD_MENU,
  ADD_MENUS,
  ADD_MENUS_REQUEST,
  SET_MENUS_LOADING,
  RESET_MENUS,
  MENUS_API,
} from '../constants/menu';
import { addErrorNotification, addSuccessNotification } from './notifications';
import getError from '../utils/getError';

export const getMenus = (query) => {
  return (dispatch) => {
    dispatch(loadingMenus());
    return axios
      .get(MENUS_API, {
        params: query,
      })
      .then((response) => {
        dispatch(addMenus(response.data.nodes));
        dispatch(
          addMenusRequest({
            data: response.data.nodes.map((item) => item.id),
            query: query,
            total: response.data.total,
          }),
        );
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      })
      .finally(() => dispatch(stopMenusLoading()));
  };
};

export const getMenu = (id) => {
  return (dispatch) => {
    dispatch(loadingMenus());
    return axios
      .get(MENUS_API + '/' + id)
      .then((response) => {
        dispatch(getMenuById(response.data));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      })
      .finally(() => dispatch(stopMenusLoading()));
  };
};

export const addMenu = (data) => {
  return (dispatch) => {
    dispatch(loadingMenus());
    return axios
      .post(MENUS_API, data)
      .then(() => {
        dispatch(resetMenus());
        dispatch(addSuccessNotification('Menu added'));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      });
  };
};

export const updateMenu = (data) => {
  return (dispatch) => {
    dispatch(loadingMenus());
    return axios
      .put(MENUS_API + '/' + data.id, data)
      .then((response) => {
        dispatch(getMenuById(response.data));
        dispatch(addSuccessNotification('Menu updated'));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      })
      .finally(() => dispatch(stopMenusLoading()));
  };
};

export const deleteMenu = (id) => {
  return (dispatch) => {
    dispatch(loadingMenus());
    return axios
      .delete(MENUS_API + '/' + id)
      .then(() => {
        dispatch(resetMenus());
        dispatch(addSuccessNotification('Menu deleted'));
      })
      .catch((error) => {
        dispatch(addErrorNotification(getError(error)));
      });
  };
};

export const loadingMenus = () => ({
  type: SET_MENUS_LOADING,
  payload: true,
});

export const stopMenusLoading = () => ({
  type: SET_MENUS_LOADING,
  payload: false,
});

export const getMenuById = (data) => ({
  type: ADD_MENU,
  payload: data,
});

export const addMenus = (data) => ({
  type: ADD_MENUS,
  payload: data,
});

export const addMenusRequest = (data) => ({
  type: ADD_MENUS_REQUEST,
  payload: data,
});

export const resetMenus = () => ({
  type: RESET_MENUS,
});
