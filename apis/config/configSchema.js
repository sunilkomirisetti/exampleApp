module.exports.configSchema = { 
                               configId: {
                                    type: Number,
                                    unique: true,
                                    required: true,
                                    index: true
                                },
                                configName: { 
                                    type: String,
                                    required: true
                                },
                                pageObjects: { 
                                    type: [],
                                    required: true
                                },
                                createdBy: {
                                    type: Number,
                                    required: true
                                },
                                updatedBy: {
                                    type: Number
                                },
                                dateCreated: {
                                    type: Number
                                },
                                dateUpdated: {
                                    type: Number
                                },
                                status: {
                                    type: String,
                                    required: true
                                }
};