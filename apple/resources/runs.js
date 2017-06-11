const jsonApi = require("../../.");
const MongoStore = require("../../../jsonapi-store-mongodb");
//var rppHandler = require("../handlers/rppHandler.js");

jsonApi.define({
  namespace: "json:api",
  resource: "runs",
  description: "Hourly run history collections.",
  handlers: new MongoStore({
    url: process.env.MONGO_URL
  }),
  searchParams: {},
  attributes: {
    id: jsonApi.Joi.string().default(jsonApi.Joi.ref('_id')),
    _id: jsonApi.Joi.string(),
    host: jsonApi.Joi.string().trim()
      .description("The host name.")
      .example("rpp.hostname.com"),
    objectId: jsonApi.Joi.string().required()
      .description("The tag or alarmDef this history is for."),
    device_id: jsonApi.Joi.string().required()
      .description("The device that the objectId belongs to."),
    timestamp: jsonApi.Joi.date().required() // also, for javascript timestamp (milliseconds)
      .description("The beginning hour.")
      .example("1463672736248"),
    hourlyRuntime: jsonApi.Joi.number().integer()
      .description("The number of seconds in the hour the object was in a non zero state.")
      .example("3400"),
    hourlyRuncounts: jsonApi.Joi.number().integer()
      .description("The number of times in the hour the object went from zero to non-zero.")
      .example("12")
  },
  examples: [{}]
});
