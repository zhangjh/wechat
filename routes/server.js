var express = require('express');
var request = require('request');
var WXBizDataCrypt = require('../lib/WXBizDataCrypt')
var server = {};

function getIndex(arr,val,type){
    for(var i=0;i<arr.length;i++){
	if(arr[i][type] === val){
	    return i;
	}
    }
    return -1;
}


server.index = function(req,res){
    res.send("Hello world.");
};

server.getToken = function(req,res){
    var appId = "wxf547409a13d381b4";
    var appSecret = "69137f180efdff7015d75f4f140d24de";
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret;
    request(url,function(e,r,b){
	if(!e && r.statusCode == 200){
	    console.log(b);
	    res.send(JSON.parse(b).access_token);
        }else {
	    res.send(JSON.parse(b).errmsg);
	}
    });
};

server.favorite = function(mongoose){
    return function(req,res){
	var nickName = req.query.nickName;
	var avatarUrl = req.query.avatarUrl;
	var province = req.query.province;
	var content = req.query.content;
	var id = req.query.id;
	// mongoose save
	var data = {
	    id: id,
	    nickName: nickName,
	    avatarUrl: avatarUrl,
	    province: province,
	    content: content
	};
	mongoose.insert("shenhuifu",data,function(ret){
	   if(ret.status){
		res.send("Save ok.");
	   }else{
		res.send("Save fail: " + ret.msg);
	   }
	});
    };
};

server.getFavorite = function(mongoose){
    return function(req,res){
	var nickName = req.query.nickName;
	if(!nickName){
	    res.json({
		status: false,
		msg: "missing parameter nickName"
	    });
	    return;
	}
	var findPattern = {
	    nickName: nickName
	};
        console.log(findPattern);
	mongoose.find("shenhuifu",findPattern,function(ret){
	    res.json(ret);
	});
    };
};

server.unFavorite = function(mongoose){
    return function(req,res){
	var id = req.query.id;
	if(!id){
	    res.json({
		status: false,
		msg: "missing parameter id"
	    });
	    return;
	}
	mongoose.remove("shenhuifu",{id: id},function(ret){
	    res.json(ret);
	});
    };
};

server.like = function(mongoose){
    return function(req,res){
	var id = req.query.id;
	var avatarUrl = req.query.avatarUrl;
	var nickName = req.query.nickName;
	if(!id){
	    res.json({
		status: false,
		msg: "missing parameter id"
	    });
	    return;
	}
	mongoose.find("like",{id:id},function(ret){
	    if(ret.status){
		var avatarUrls = [];
		var likeNames = [];
		var cnt = 0;
		console.log(ret);
		if(ret.data[0] && ret.data[0].avatarUrls){
		    avatarUrls.push({avatarUrl: avatarUrl});
		    likeNames.push({likeName: nickName});
		    cnt = ret.data[0].cnt + 1;
		}
		mongoose.update("like",{id:id},{cnt: cnt,avatarUrls: avatarUrls,likeNames: likeNames},{multi:true},function(ret){
		    res.json(ret);
		});
	    }else{
		console.log([avatarUrl]);
		mongoose.insert("like",{id:id,cnt:1,avatarUrls: [{avatarUrl: avatarUrl}],likeNames: [{likeName: nickName}]},function(ret){
		    res.json(ret);
		});
	    }
	});
    };
};

server.unLike = function(mongoose){
	return function(req,res){
		var id = req.query.id;
		var avatarUrl = req.query.avatarUrl;
		var nickName = req.query.nickName;
		if(!id){
			res.json({
				status: false,
				msg: "missing parameter id"
			});
			return;
		}
		mongoose.find("like",{id:id},function(ret){
			if(ret.status){
				if(!ret.cnt){
				    ret.cnt = 0;
				}
				if(!ret.avatarUrls){
				    ret.avatarUrls = [];
				}
				if(!ret.likeNames){
				    ret.likeNames = [];
				}
				var avatarIndex = getIndex(ret.avatarUrls,avatarUrl,"avatarUrl");
				if(avatarIndex !== -1){
				    ret.avatarUrls.splice(avatarIndex,1);
				}
				var likeNameIndex = getIndex(ret.likeNames,nickName,"likeName");
				if(likeNameIndex !== -1){
				    ret.likeNames.splice(likeNameIndex,1);
				}
			
				mongoose.update("like",{id:id},{cnt:ret.cnt-1,avatarUrls: ret.avatarUrls,likeNames: ret.likeNames},function(ret){
					res.json(ret);
				});
			}else{
				res.json(ret);
			}
		});
	};
};

server.getLike = function(mongoose){
	return function(req,res){
		var id = req.query.id;
		if(!id){
			res.json({
				status: false,
				msg: "missing parameter id"
			});
			return;
		}
		mongoose.find("like",{id:id},function(ret){
			res.json(ret);
		});
	};
};


// slim
server.getOpenId = function(){
	return function(req,res){
		var appid = "wxfe6ed885a3c63032";
		var secret = "595a59c6edde54010fcb601c8ea66492";
		var grant_type = "authorization_code";
		var js_code = req.query["js_code"];
		if(!js_code){
			res.json({
				status: false,
				msg: "missing js_code"
			});
		}
		var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + js_code + "&grant_type=authorization_code";
		request(url,function(e,r,b){
			if(e){
				res.json({
					status: false,
					msg: e
				});
			}else {
				res.json({
					status: true,
					data: b
				});
			}
		});
	};
};

server.decrypt = function(){
	return function(req,res){
		var appId = 'wxfe6ed885a3c63032';
		var sessionKey = req.query.sessionKey;
		var encryptedData = req.query.encryptedData;
		var iv = req.query.iv;

		var pc = new WXBizDataCrypt(appId, sessionKey);
		var data = pc.decryptData(encryptedData, iv);
		console.log("解密后 data: ", data);
		res.json({
			status: true,
			data: data
		});
	};
};

server.saveObject = function(mongoose){
    return function(req,res){
		var openId = req.query.openId;
		var nickName = req.query.nickName;
		var gender = req.query.gender;
		var city = req.query.city;
		var curWeight = req.query.curWeight;
		var objectWeight = req.query.objectWeight;
		var endDate = req.query.endDate;

		if(!openId){
			res.json({
				status: false,
				msg: "missing parameter openId, plz login first"
			});
			return;
		}
	
		var data = {
			nickName: nickName,
			gender: gender,
			city: city,
			curWeight: curWeight,
			objectWeight: objectWeight,
			endDate: endDate
		};		

		mongoose.find("slimObject",{openId: openId},function(ret){
			console.log(ret);
			if(ret.status && ret.data && ret.data[0]){
				mongoose.update("slimObject",{openId: openId},data,{},function(ret){
					res.json(ret);
				});
			}else {
				data.openId = openId;
				mongoose.insert("slimObject",data,function(ret){
					res.json(ret);
				});
			}
		});
    };
};

server.getObject = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		if(!openId){
			res.json({
				status: false,
				msg: "missing parameter openId, plz login first"
			});
			return;
		}
		mongoose.find("slimObject",{openId: openId},function(ret){
			res.json(ret);
		});
	};
};

server.sign = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
        var date = req.query.date;
		var signed = req.query.signed;

        if(!openId || !date){
            res.json({
                status: false,
                msg: "missing parameter, plz check"
            });
            return;
        }

		mongoose.find("slimSign",{openId: openId,date: date},function(ret){
			if(ret.status && ret.data && ret.data[0]){
				console.log(ret.data);
				mongoose.update("slimSign",{openId: openId,date: date},{signed: signed},{},function(ret){
					res.json(ret);
				});
			}else {
				mongoose.insert("slimSign",{openId: openId,date: date,signed: signed},function(ret){
					res.json(ret);
				});
			}
		});
	};
};

server.signed = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		var date = req.query.date;
		if(!openId || !date){
            res.json({
                status: false,
                msg: "missing parameter, plz check"
            });
            return;
        }

		mongoose.find("slimSign",{openId: openId,date: date},function(ret){
			res.json(ret);
		});
	};
};

server.isSigned = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		var date = req.query.date;

		if(!openId || !date){
            res.json({
                status: false,
                msg: "missing parameter, plz check"
            });
            return;
        }

		mongoose.find("slimSign",{openId: openId,date: date},function(ret){
			console.log(ret);
			res.json({
				status: ret.status,
				data: !!(ret.data && ret.data[0] && ret.data[0].signed === 1)
			});
		});
	};
};

server.saveTodayWeight = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		var date = req.query.date;
		var weight = req.query.weight;

		if(!openId || !date){
            res.json({
                status: false,
                msg: "missing parameter, plz check"
            });
            return;
        }

		mongoose.find("todayWeight",{openId: openId,date: date},function(ret){
			if(ret.status && ret.data && ret.data[0]){
				mongoose.update("todayWeight",{date: date,openId: openId},{weight: weight},{multi: true},function(ret){
					res.json(ret);
				});
			}else {
				mongoose.insert("todayWeight",{openId: openId,date: date,weight: weight},function(ret){
					res.json(ret);
				});	
			}
		});
	};
};

function commonFindBatch(mongoose,collection,condition,cb){
	var openId = condition.openId;
	var findPattern = condition.findPattern;
	if(!openId || !findPattern){
		if(cb){
			cb({
				status: false,
				msg: "missing parameter, plz check"
			});
		}
	}
	findPattern = new RegExp(findPattern);

	mongoose.findBatch(collection,{openId: openId,date: findPattern},function(ret){
		if(cb)cb(ret);
	});
}

server.getSignedBatch = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		var findPattern = req.query.findPattern;
		commonFindBatch(mongoose,'slimSign',{openId: openId,findPattern: findPattern},function(ret){
			res.json(ret);
		});
	};
};

server.getWeightBatch = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		var findPattern = req.query.findPattern;
		commonFindBatch(mongoose,'todayWeight',{openId: openId,findPattern: findPattern},function(ret){
			console.log(ret);
			res.json(ret);
		});
	};
}

server.statUsers = function(mongoose){
	return function(req,res){
		var openId = req.query.openId;
		var nickName = req.query.nickName;
		var gender = req.query.gender;
		var city = req.query.city;
		var avatarUrl = req.query.avatarUrl;
		var province = req.query.province;
		var data = {
			openId,
			nickName,
			gender,
			city,
			avatarUrl,
			province
		};
		mongoose.find("statUser",{openId: openId},function(ret){
			if(!ret.status || !ret.data || !ret.data.length){
				mongoose.insert("statUser",data,function(ret){
					res.json(ret);
				});
			}else {
				res.json({
					status: false,
					msg: "Already stat this user"
				});
			}		
		});
	};	
};

module.exports = server;
