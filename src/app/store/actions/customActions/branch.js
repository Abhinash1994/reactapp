import branchApis from '../../../services/BranchService'
import { SET_BRANCH } from '../types';
const setBranch = data => ({
    type: SET_BRANCH,
    payload: data
})
export const getAllBranch = () => async dispatch => {
    try {
        let all_branch = await branchApis.getAllBranch();
        dispatch(setBranch({
            branchs: all_branch
        }));
    } catch (error) {
        console.log(error);
    }
}