// import { VideoCallStatus } from '@pushprotocol/restapi';
// import { ADDITIONAL_META_TYPE } from '@pushprotocol/restapi/src/lib/payloads/constants';

// pushSDKSocket?.on(EVENTS.USER_FEEDS, (feedItem: any) => {
//     // The event listner for the USER_FEEDS event
//     const { payload } = feedItem || {};
//     // we check if the additionalMeta property is present in payload.data
//     if (payload.hasOwnProperty('data') && payload['data'].hasOwnProperty('additionalMeta')) {
    
//         const additionalMeta = payload['data']['additionalMeta'];
        
    
//         if (additionalMeta.type === `${ADDITIONAL_META_TYPE.PUSH_VIDEO}+1`){
//             const videoCallMetaData = JSON.parse(additionalMeta.data);
        
            
//             if (videoCallMetaData.status === VideoCallStatus.INITIALIZED) {
//                 const {
                   
//                     recipientAddress,
                
//                     senderAddress,
                    
//                     // the unique identifier for every push chat, here, the one between the senderAddress and the recipientAddress
//                     chatId,
                    
//                     // webRTC signal data received from the peer which sent this notification
//                     signalData,
                    
                  
//                     status,
//                 } = videoCallMetaData;
              
//                 videoObject.setData((oldData) => {
//                   return produce(oldData, (draft) => {
//                     draft.local.address = recipientAddress;
//                     draft.incoming[0].address = senderAddress;
//                     draft.incoming[0].status = PushAPI.VideoCallStatus.RECEIVED;
//                     draft.meta.chatId = chatId;
//                     draft.meta.initiator.address = senderAddress;
//                     draft.meta.initiator.signal = signalData;
//                   });
//                 });
    
//             }
//         }
//     }
// });

// await videoObject.acceptRequest({
//     signalData: any;
//     senderAddress: string;
//     recipientAddress: string;
//     chatId: string;
//     onReceiveMessage?: (message: string) => void;
//     retry?: boolean;
//   });
  

//   await videoObject.acceptRequest({
//     signalData: data.meta.initiator.signal;
//     senderAddress: data.local.address;
//     recipientAddress: data.incoming[0].address;
//     chatId: data.meta.chatId;
//   });

