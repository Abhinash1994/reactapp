import CompanyService from '../../../services/CompanyService'
import { SET_SETTING } from '../types';
const setCompany = data => ({
  type: SET_SETTING,
  payload: data
})
export const getCompany = () => async dispatch => {
  try {
    let companys = await CompanyService.getCompanys();
    if (companys.length) {
      dispatch(setCompany({
        branchs: companys[0]
      }));
    }
  } catch (error) {
    console.log(error);
  }
}