import api from 'app/ApiConfig'
import {setselectedContactId} from './contacts.actions';
import {closeMobileChatsSidebar} from './sidebars.actions';


export const GET_CHAT = '[CHAT APP] GET CHAT';
export const REMOVE_CHAT = '[CHAT APP] REMOVE CHAT';
export const SEND_MESSAGE = '[CHAT APP] SEND MESSAGE';

export function getChat(contactId)
{
    return (dispatch, getState) => {
        const request = api.post('/chat/getChat', {
            event_id: getState().chatApp.events.selectedEventId,
            contactId,
            // user_id: id
        });

        return request.then((response) => {

            dispatch(setselectedContactId(contactId));

            dispatch(removeChat());

            dispatch(closeMobileChatsSidebar());

            return dispatch({
                type        : GET_CHAT,
                chat        : response.data.doc,
                // chat        : response.data.chat,
                // userChatData: response.data.userChatData
            });
        });
    }
}

export function removeChat()
{
    return {
        type: REMOVE_CHAT
    };
}

export function sendMessage(messageText, chatId, userId, messageType, filename)
{
    return (dispatch, getState) => {
        const message = {
            'event_id' : getState().chatApp.events.selectedEventId,
            'contactId' : getState().chatApp.contacts.selectedContactId,
            'who'    : userId,
            'message': messageText,
            'message_type' : messageType,
            'filename': filename,
            'time'   : new Date()
        };

        const request = api.post('/chat/sendMessage', {
            message
        });
    
        return request.then((response) => {

                return dispatch({
                    type        : SEND_MESSAGE,
                    message     : response.data.doc,
                    userChatData: response.data.userChatData
                })}
            );
    }
}
