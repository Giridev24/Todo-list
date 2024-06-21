const mongoose = require('mongoose')

const Sampleschema = new mongoose.Schema({
    todo: String,
    done:{
        type: Boolean,
        default: false
    }
})

const SampleModel = mongoose.model("sample", Sampleschema)
module.exports = SampleModel