import api from '../../../app/ApiConfig'
import { Apis } from "../../../config";
import { NotificationManager } from 'react-notifications';

const getAllProjects = async () => {
  try {
    let result = await api.post(Apis.GetAllProjects);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return [];
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
const getProject = async () => {
  try {
    let result = await api.post(Apis.GetProjectApi);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const createProject = async data => {
  try {
    console.log(data);
    let result = await api.post(Apis.CreateProjectApi, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const updateProject = async data => {
  try {
    let result = await api.post(Apis.UpdateProjectApi, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const removeProject = async id => {
  try {
    let result = await api.post(Apis.RemoveProjectApi, id);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return false;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getAllTasks = async () => {
  try {
    let result = await api.post(Apis.GetAllTasks);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return false;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const createTask = async data => {
  try {
    let result = await api.post(Apis.CreateTask, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return false;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const updateTask = async data => {
  try {
    let result = await api.post(Apis.UpdateTask, data);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return false;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const getEmployeeNames = async () => {
  try {
    let result = await api.post(Apis.GetEmployeeNames);
    if (result.data.error) {
      NotificationManager.error(result.data.error);
      return false;
    }
    return result.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default {
  getProject,
  getAllProjects,
  createProject,
  updateProject,
  removeProject,
  getAllTasks,
  createTask,
  updateTask,
  getEmployeeNames
}