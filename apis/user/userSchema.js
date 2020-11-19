module.exports.userSchema = { 
                               userId: {
                                    type: Number,
                                    unique: true,
                                    required: true,
                                    index: true
                                },
                                userName: { 
                                    type: String,
                                    index: true
                                },
                                phoneNumber: { 
                                    type: String
                                },
                                emailAddress: { 
                                    type: String,
                                    unique: true,
                                    required: true
                                },
                                password: {
                                    type: String,
                                    required: true
                                }
};