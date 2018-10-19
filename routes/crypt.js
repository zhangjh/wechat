var WXBizDataCrypt = require('../lib/WXBizDataCrypt')

var appId = 'wxfe6ed885a3c63032';
var sessionKey = 'KxHohqZDhktakYyhmSqNQg==';
//var encryptedData = 'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZMQmRzooG2xrDcvSnxIMXFufNstNGTyaGS9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+3hVbJSRgv+4lGOETKUQz6OYStslQ142dNCuabNPGBzlooOmB231qMM85d2/fV6ChevvXvQP8Hkue1poOFtnEtpyxVLW1zAo6/1Xx1COxFvrc2d7UL/lmHInNlxuacJXwu0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn/Hz7saL8xz+W//FRAUid1OksQaQx4CMs8LOddcQhULW4ucetDf96JcR3g0gfRK4PC7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns/8wR2SiRS7MNACwTyrGvt9ts8p12PKFdlqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYVoKlaRv85IfVunYzO0IKXsyl7JCUjCpoG20f0a04COwfneQAGGwd5oa+T8yO5hzuyDb/XcxxmK01EpqOyuxINew=='

var encryptedData = 'DL0phntg81IAJ6+dQsm+x5RKL/q2SJNVokAqqYyQXfkSXjw06iQh6OvIIBnpNG9f+LWC+1kpipDTJEkqcVwWM3yQV8h/edqCL84dT8PN5bWHLpZrq4rwACiTvMiyT3wZV6ntdvz6YBr3Agpi2v+q2atUp08DQGfwFVs/yLd3hOmKHoPqZ2Hif2OptpzhW/+C7iGGMV56tEdoXMcaIoKc+FOaGvwsDkud4PnjAgBPzyIYu/nxVTIhJ8Y9XG4j2mPL+B1nE45UiWKLqY1keLbqXa1oYl8SWwo44VHNwMBfbIWjFnxp42lsoQQpKs3FZDXZjd8i+k742/Hnrp9vQPFX0I9igm4T2yHthHWHnCmsRg0yF6Y3VXXc5d6urPkcNhLkgEmGmSdJ49pj9SH7V2Aa59ewUqf4STWrC7xxmchUHdMFLdZLYgVf8AOSbi/kpPAoD5f/BFROYwyxXw0eag9cFVFcxxRNnyJaJVWt6e7mF90=';
var iv = 'lDW8SC3vT8fL0VBTdKVx8w==';

var pc = new WXBizDataCrypt(appId, sessionKey)

console.log(appId);
console.log(sessionKey);
console.log(iv);
console.log(encryptedData);
var data = pc.decryptData(encryptedData , iv)

console.log('解密后 data: ', data)
// 解密后的数据为
//
// data = {
//   "nickName": "Band",
//   "gender": 1,
//   "language": "zh_CN",
//   "city": "Guangzhou",
//   "province": "Guangdong",
//   "country": "CN",
//   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
//   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
//   "watermark": {
//     "timestamp": 1477314187,
//     "appid": "wx4f4bc4dec97d474b"
//   }
// }

