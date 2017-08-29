export const CALL_API = Symbol('CALL_API'); 

export default store => next => action => { 
  if ( !action[CALL_API] ) { 
    	return next(action); 
  }
  let request = action[CALL_API]; 
  let { method, path, failureType, successType, sendingType } = request;
  let { dispatch } = store; 
    
    dispatch({ type: sendingType }); 

    console.log(process.env);
    
    fetch(process.env.REACT_APP_API_URL + path, { method: method})
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            dispatch({ 
                type: successType, 
                response: json 
            });
        }).catch(function(ex) {
            dispatch({ 
                type: failureType, 
                response: ex 
            });
        });
};