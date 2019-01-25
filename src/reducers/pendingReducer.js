import InitialState from "./initialStates";

export function pendingReducer(state = InitialState.pending, action) {
    const {type, data} = action;
    switch (type) {
        default :
            if (type.indexOf("_PENDING") > -1) {
                const indexOf = type.indexOf("_PENDING");
                const sub = type.substr(0,indexOf);
                const _payload = [...state.payload];
                _payload.push(sub);
                state = state.set("payload",_payload);
            }
            else{
                if(type.indexOf("_FAILED") > -1){
                    const indexOf = type.indexOf("_FAILED");
                    const sub = type.substr(0,indexOf);
                    let _payload = [...state.payload];
                    _payload = _payload.filter(e =>e !== sub);
                    state = state.set("payload",_payload);
                }
                else{
                    if(type.indexOf("_SUCCESS") > -1){
                        const indexOf = type.indexOf("_SUCCESS");
                        const sub = type.substr(0,indexOf);
                        let _payload = [...state.payload];
                        _payload = _payload.filter(e =>e !== sub);
                        state = state.set("payload",_payload);
                    }
                }
            }
            return state

    }

}