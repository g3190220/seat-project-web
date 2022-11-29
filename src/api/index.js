import Axios from 'axios';

const basicHeader = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
}

Axios.defaults.timeout = 30000;
Axios.defaults.baseURL = process.env.VUE_APP_CONTEXT_PATH;


// FormData 格式
const formDataInstance = Axios.create();
formDataInstance.interceptors.request.use(
    (config) => {
        config.headers = basicHeader;
        config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    },
    (error) => {
        window.location = 
            process.env.VUE_APP_CONTEXT_PATH + '/error/' + error.response.status;
    }

)

// 瀏覽器的原生 form 表單格式
const formInstance = Axios.create();
formInstance.interceptors.request.use(
    (config) => {
        config.data = JSON.stringify(config.data)
        config.headers = basicHeader;
        config.headers['Content-Type'] = 
            'application/x-www-form-urlencoded; charset=UTF-8';
        return config;
    },
    (error) => {
        window.location = 
            process.env.VUE_APP_CONTEXT_PATH + '/error/' + error.response.status;
    }
)

// JSON表單格式
const jsonInstance = Axios.create();
jsonInstance.interceptors.request.use(
    (config) => {
        config.data = JSON.stringify(config.data)
        config.headers = basicHeader;
        config.headers['Content-Type'] = 
            'application/json; charset=UTF-8';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// http response 攔截器
jsonInstance.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            return response.data
        }
    },
    (error) => {
        window.location = 
            process.env.VUE_APP_CONTEXT_PATH + '/error/' + error.response.status;
    }
)

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        jsonInstance
            .get(url,{
                params: params,
            })
            .then((r) => {
                resolve(r.response);
            })
            .catch((err) => {
                reject(err);
            })
    }
    )
}
export function post(url, data = {}, config = {}){
    let instance;
    if(config.formType === 'json'){
        instance = jsonInstance;
    } else if (config.formType === 'form'){
        instance = formInstance;
    } else if (config.formType === 'formData'){
        instance = formDataInstance;
    } else {
        instance = jsonInstance;
    }
    return new Promise((resolve, reject) => {
        instance.post(url, data, config).then(
            (response) => {
                resolve(config.formType === 'formData' ? response.data : response) 
            },
            (err) => {
                reject(err);
            }
        )
    }
    )
}

export function del(url, data = {}, config = {}){
    let instance;
    if(config.formType === 'json'){
        instance = jsonInstance;
    } else if (config.formType === 'form'){
        instance = formInstance;
    } else if (config.formType === 'formData'){
        instance = formDataInstance;
    } else {
        instance = jsonInstance;
    }
    return new Promise((resolve, reject) => {
        instance.delete(url, data, config).then(
            (response) => {
                resolve(config.formType === 'formData' ? response.data : response) 
            },
            (err) => {
                reject(err);
            }
        )
    }
    )
}

export function put(url, data = {}, config = {}){
    let instance;
    if(config.formType === 'json'){
        instance = jsonInstance;
    } else if (config.formType === 'form'){
        instance = formInstance;
    } else if (config.formType === 'formData'){
        instance = formDataInstance;
    } else {
        instance = jsonInstance;
    }
    return new Promise((resolve, reject) => {
        instance.put(url, data, config).then(
            (response) => {
                resolve(config.formType === 'formData' ? response.data : response) 
            },
            (err) => {
                reject(err);
            }
        )
    }
    )
}

