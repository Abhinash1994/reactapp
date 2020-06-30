import api from 'app/ApiConfig.js'
import history from 'history.js';

export const FORGOT_PASSWORD = '[FORGOT_PASSWORD]';


export function forgot(email)
{
    const request = api.post('/password/forgotPassword', email);

    return (dispatch) =>{
        request.then((response) => {
            console.log("response", response)
            dispatch({
                type: FORGOT_PASSWORD,
                payload: response.data.doc
            })
            history.push({
                pathname: '/mail-confirm'
            });
        })
    }
      
}
