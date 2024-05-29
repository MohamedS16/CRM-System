const Group = require('./../models/Group.js')

let incrementGroupStudents = async(groupId,number)=>{
    let incrementGroup = await Group.updateOne({groupName : groupId},
        {
            $inc : {groupStudents : number }
        }
    )
    if(incrementGroup.matchedCount != 1){
        return 'Group Not Found'
    }else{
        if(incrementGroup.modifiedCount != 1){
            return 'Nothing Changed, Please Try Again'
        }else{
            return 'Done'
        }
    }
}


module.exports = incrementGroupStudents