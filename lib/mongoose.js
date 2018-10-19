/*
 * Des：mongodb连接函数
 * Author：njhxzhangjihong@126.com
 * Date：5/4/2016
 * Ver：1.0
 * */

var DEBUG = false;
var DB_IP = "127.0.0.1",
    DB_PORT = "20172",
    DB_NAME = "wechat";

if(DEBUG){
    DB_IP = "10.101.73.67";
}
var DB_URL = "mongodb://" + DB_IP + ":" + DB_PORT + "/" + DB_NAME;

var mongoose = require("mongoose");

console.log("DB_URL: " + DB_URL);

//定义schema
function defineSchema(collection){
    switch(collection){
	  case "shenhuifu":
          return new mongoose.Schema({
              nickName: {type: String},
              avatarUrl: {type: String},
	      province: {type: String},
	      content: {type: String},
  	      id: {type: String}
          });
          break;
	case "like":
	return new mongoose.Schema({
		id: {type: String},
		avatarUrls: {type: Array,default: [{"avatarUrl":" "}]},
		cnt: {type: Number,default: 0},
		likeNames: {type: Array,default: [{"likeName":" "}]},
	});
    default:
        return new mongoose.Schema({
            id: {type: Number},
            user: {type: String}
        });
        break;
    }
}

function connect(collection,cb){
    var db = mongoose.createConnection(DB_URL);
    db.on('error',function(e){
        return console.error(e);        
    });

    db.once('open',function(){
        var tableSchema = defineSchema(collection);  
        //将schema发布为model
        var tableModel = db.model(collection,tableSchema);
        if(!db.model(collection)){
            return console.error("model list deploy failed!");
        }
        
        if(cb)cb(db,tableModel);
    });
}

//insert
exports.insert = function(collection,data,callback){
    connect(collection,function(db,tableModel){
        var mongoEntity = new tableModel(data);
        mongoEntity.save(function(e){
            db.close();
            if(e)callback({
		status: false,
		msg: e
	    }); 
            else callback({
		status: true,
		msg: "Insert ok."
	    });
        });
    });
};

//find
exports.find = function(collection,findPattern,callback){
    connect(collection,function(db,tableModel){
        tableModel.find(findPattern).exec(function(e,res){
            db.close();
            if(e)callback({
		status: false,
		msg: e
	    });    
            else callback({
		status: true,
		data: res
	    });
        });        
    });
};


exports.findBatch = function(collection,findPattern,callback){
	connect(collection,function(db,tableModel){
		tableModel.find({}).where(findPattern).exec(function(err,res){
			callback(err,res);
		});
	});
};

//update
exports.update = function(collection,updateCondition,update,options,callback){
    connect(collection,function(db,tableModel){
        tableModel.find(updateCondition,function(e,res){
            if(res){
                tableModel.update(updateCondition,update,options,function(e){
                        db.close();
                        if(e)callback({
			    status: false,
			    msg: e
			});
                        else callback({
			    status: true
			});
                    });
            }else {
		callback({
		    status: false,
		    msg: "Update error: No this data exist."
		});
            }    
        });        
    });
};

//remove 
exports.remove = function(collection,removeCondition,callback){
    connect(collection,function(db,tableModel){
        tableModel.find(removeCondition,function(e,res){
            if(res){
                tableModel.remove(removeCondition,function(e){
                    db.close();
                    if(e)callback({
			status: false,
			msg: e
		    });
                    else callback({
			status: true
		    });
                });
            }else {
		callback({
		    status: false,
		    msg: "Remove error: No this data exist."
		});
            }
        });        
    });
};
