// export const API_PATH = 'http://192.168.0.126:30072'
export const API_PATH = window.location.origin.includes('localhost')||window.location.origin.includes('dev')?'http://ad.dev.gemii.cc:58080':window.location.origin.includes('test')?'http://ad.test.gemii.cc:58080':'http://ad.cloud.gemii.cc'
