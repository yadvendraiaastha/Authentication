const mongoose = require("mongoose");
const ProfileSchema = mongoose.Schema({

    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    
}, {timestamps : true});

module.exports = mongoose.model("Profile",ProfileSchema);