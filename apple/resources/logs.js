const jsonApi = require("../../.");
const MongoStore = require("../../../jsonapi-store-mongodb");
//var rppHandler = require("../handlers/rppHandler.js");
const REGEX_LOG_LEVEL = /(^Warning$)|(^Info$)|(^Error$)|(^Fatal$)$/gi;

jsonApi.define({
  namespace: "json:api",
  resource: "logs",
  description: "System log events.",
  handlers: new MongoStore({
    url: process.env.MONGO_URL
  }),
  searchParams: {},
  attributes: {
    id: jsonApi.Joi.string().default(jsonApi.Joi.ref('_id')),
    _id: jsonApi.Joi.string(),
    timestamp: jsonApi.Joi.date().required() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of the log.")
      .example("1463672736248"),
    logLevel: jsonApi.Joi.string().insensitive().trim().regex(REGEX_LOG_LEVEL).default('Info')
      .description("The log level severity which can be Warning, Info, Error, Fatal.")
      .example("Error"),
    host: jsonApi.Joi.string().trim()
      .description("The log origination host name.")
      .example("my.host.name.com"),
    tagname: jsonApi.Joi.string().trim()
      .description("The log origination tag name if there is one.")
      .example("MY_AWESOME_TAGNAME"),
    deviceName: jsonApi.Joi.string().trim()
      .description("The log origination device name if there is one.")
      .example("MY_AWESOME_DEVICE"),
    username: jsonApi.Joi.string().trim()
      .description("The log origination username if there is one.")
      .example("System"),
    message: jsonApi.Joi.string().trim()
      .description("The log message that describes the event.")
      .example("The system has crashed.")
  },
  examples: [{}]
});
