let Group = require('../models/Group.js')

let checkGroup = async(group)=>{
        let checkGroup = await Group.findOne({groupName : group})

        if(!checkGroup){
            return "Group Not Found"
        }else{
            return checkGroup
        }   
    
}

module.exports = checkGroup

