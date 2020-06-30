export default () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('jwt_access_token')
    }
  };
};