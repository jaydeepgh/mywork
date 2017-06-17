import axios from 'axios';
const API_KEY = '1ef0e636cc491badb7b713d53e69683d';
const ROOT_URL = `http://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}`;
export const FETCH_WEATHER = 'FETCH_WEATHER';
export const CALL_API = 'CALL_API';

export function fetchWeather(city)
{
    const url = `${ROOT_URL}&q=${city},in`;
    const request = axios.get(url);

    //console.log('Request : ',request);

    return{
        type : FETCH_WEATHER,
        payload: request
    };
}

export function callApi(data)
{
    //console.log(data.name);
    /*
    const test = {
  "jsonrpc": "2.0",
  "method": "query",
  "params": {
    "type": 1,
    "chaincodeID": {
      "name": "be5700152ad28118fbddce663387991e06da5c62a404657c7d2e20e28f2545152e6055d898bf3475285920193f1d6f51260848907a2757ee9e5b527c4b479845"
    },
    "ctorMsg": {
      "function": "getAssemblyLineStatus",
      "args": ["25K09825"]
    },
    "secureContext": "user_type1_0"
  },
  "id": 0
}; 
*/
    const url = 'https://getstartednode-nonlayered-photosynthate.mybluemix.net/api/visitors'
    //let request = null; 
    //const url = 'https://6ab2bee7541a48899971d1851b828ecb-vp0.us.blockchain.ibm.com:5004/chaincode';
    const request = axios.post(url, data).then((response)=>{console.log(response);return response;}).catch((err) => {
        //console.log(err);
        return {data : data.name}; 
    });
    //console.log(request);
    
    return{
        type : CALL_API,
        payload : request
    }
}