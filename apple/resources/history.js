var jsonApi = require("../../.");
var MongoStore = require("../../../jsonapi-store-mongodb");
//var rppHandler = require("../handlers/rppHandler.js");

jsonApi.define({
  namespace: "json:api",
  resource: "history",
  description: "History table for storing timestamped tag values.",
  handlers: new MongoStore({
    //url: "mongodb://localhost:27017/",
    //url: "mongodb://swagger:swagger1234@localhost:27017/Apple?ssl=true",
    url: "mongodb://swagger:swagger1234@localhost:27017/Apple",
  }),
  searchParams: {},
  attributes: {
    timestamp: jsonApi.Joi.date().required() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of the tag.")
      .example("1463672736248"),
    value: jsonApi.Joi.number().required()
      .description("The current value at the timestamp time of the tag.")
      .example("1245.76"),
    dataQuality: jsonApi.Joi.string().required()
      .description("Can only be OK or Bad")
      .example("OK"),
    tagId: jsonApi.Joi.string().required()
      .description("The tag this history is for.")
  },
  examples: [{}]
});