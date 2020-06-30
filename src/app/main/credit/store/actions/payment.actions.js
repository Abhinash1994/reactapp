import api from 'app/ApiConfig.js'

export const PAYMENT_SUCCESS = '[PAYMENT_SUCCESS]';


export function savePayment(payment, user_id)
{
    console.log(payment, user_id)
    const request = api.post('/payment/successPaid', {payment, user_id})

    return (dispatch) => {
        request.then((response) => {
            return dispatch({
                type        : PAYMENT_SUCCESS,
                payload        : response.data.doc,
            });
        });
    }
     
}

