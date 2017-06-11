var jsonApi = require("../../.");
var MongoStore = require("../../../jsonapi-store-mongodb");
//var rppHandler = require("../handlers/rppHandler.js");
const REGEX_LEVEL = /(^Critical$)|(^Info$)|(^Warning$)$/gi;
const REGEX_ALARM_TYPE = /(^HH$)|(^HI$)|(^LO$)|(^LL$)|(^INVALID$)$/gi;

jsonApi.define({
  namespace: "json:api",
  resource: "alarmHistory",
  description: "History table for storing timestamped tag values.",
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
    tagname: jsonApi.Joi.string().trim()
      .description("The unique tag name.")
      .example("MY_AWESOME_TAGNAME"),
    deviceName: jsonApi.Joi.string().trim()
      .description("The unique device name.")
      .example("MY_AWESOME_DEVICE"),
    tagId: jsonApi.Joi.string().required()
      .description("The tag this history is for."),
    device_id: jsonApi.Joi.string().required()
      .description("The device this history is for."),
    desc: jsonApi.Joi.string().trim()
      .description("The description of this alarm def.")
      .example("The water level is high"),
    level: jsonApi.Joi.string().insensitive().trim().regex(REGEX_LEVEL).default('Warning')
      .description("The alarm level severity.")
      .example("Critical"),
    alarmType: jsonApi.Joi.string().trim().uppercase().regex(REGEX_ALARM_TYPE).required()
      .description("The type of the alarm.")
      .example("HH"),
    setpoint: jsonApi.Joi.number().default(0)
      .description("The value that triggers the alarm.")
      .example("10"),
    timestamp: jsonApi.Joi.date().required() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of the tag.")
      .example("1463672736248"),
    alarmStatus: jsonApi.Joi.string().optional()
      .description("Is the activeAlarm clear, acked, unacked.")
      .example("Clear, acked, unacked"),
    dataQuality: jsonApi.Joi.string().optional()
      .description("The data quality from the tag.")
      .example("Ok"),
    units: jsonApi.Joi.string().optional()
      .description("The tag units.")
      .example("Volts"),
    value: jsonApi.Joi.any().optional()
      .description("The current value from the tag in engineering units.")
      .example("24.5")
  },
  examples: [{}]
});
