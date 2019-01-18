import InitialState from "./initialStates";

export function pendingReducer(state = InitialState.pending, action) {
    const {type, data} = action;
    switch (type) {
        default :
            if (type.indexOf("PENDING") > -1) {
                state = state.set("fetching", true);
            }
            else{
                if(type.indexOf("FAILED") > -1 || type.indexOf("SUCCESS") > -1){
                    state = state.set("fetching", false);
                }
            }
            return state

    }

}