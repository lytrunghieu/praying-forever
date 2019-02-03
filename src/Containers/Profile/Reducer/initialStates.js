/**
 * Created by hieult on 7/2/18.
 */
import Immutable from 'seamless-immutable';

export default initState = Immutable({
    payload: null,
    fetching: false,
    success: false,
    message: null,
    inprogress : false,
})
