var jsonApi = require("../../.");
var MongoStore = require("../../../jsonapi-store-mongodb");
//var rppHandler = require("../handlers/rppHandler.js");
const REGEX_LEVEL = /(^Critical$)|(^Info$)|(^Warning$)$/gi;
const REGEX_ALARM_TYPE = /(^HH$)|(^HI$)|(^LO$)|(^LL$)|(^INVALID$)$/gi;
const REGEX_VALUE_TYPE = /(^bool$)|(^real$)|(^integer$)|(^string$)$/gi;

jsonApi.define({
  namespace: "json:api",
  resource: "alarms",
  description: "All current alarms in the system.",
  handlers: new MongoStore({
    url: process.env.MONGO_URL
  }),
  searchParams: {},
  attributes: {
    id: jsonApi.Joi.string().default(jsonApi.Joi.ref('_id')),
    _id: jsonApi.Joi.string(),
    tagname: jsonApi.Joi.string().required()
      .description("The tag this alarm is for."),
    deviceName: jsonApi.Joi.string().required()
      .description("The tag this alarm is for."),
    tagId: jsonApi.Joi.string().required()
      .description("The tag id this alarm is for."),
    device_id: jsonApi.Joi.string().required()
      .description("The device id this alarm is for."),
    alarmDefId: jsonApi.Joi.string().required()
      .description("The alarm def id this alarm came from."),
    desc: jsonApi.Joi.string().trim()
      .description("The description from the alarm def.")
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
    dataQuality: jsonApi.Joi.string().optional()
      .description("The data quality from the tag.")
      .example("Ok"),
    units: jsonApi.Joi.string().optional()
      .description("The tag units.")
      .example("Volts"),
    value: jsonApi.Joi.any().optional()
      .description("The current value from the tag in engineering units.")
      .example("24.5"),
    valueType: jsonApi.Joi.string().trim().regex(REGEX_VALUE_TYPE)
      .default('real')
      .description('Can only be bool, real, integer or string.')
      .example('bool'),
    lastUpdate: jsonApi.Joi.date().optional() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of when the alarm was updated.")
      .example("1463672736248"),
    new_timestamp: jsonApi.Joi.date().optional() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of when the alarm was created.")
      .example("1463672736248"),
    cleared_timestamp: jsonApi.Joi.date().optional() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of when the alarm cleared.")
      .example("1463672736248"),
    acked_timestamp: jsonApi.Joi.date().optional() // also, for javascript timestamp (milliseconds)
      .description("The Unix time in milliseconds of when the alarm was acked.")
      .example("1463672736248"),
    alarmStatus: jsonApi.Joi.string().trim()
      .description("The current status of the alarm: new, acked, cleared.")
      .example("Cleared-Acked"),
    alarmAcked: jsonApi.Joi.boolean().default(false)
      .description("If true the alarm has been acked.")
      .example("true"),
    alarmReset: jsonApi.Joi.boolean().default(false)
      .description("If true the alarm has been reset.")
      .example("true")
  },
  examples: [{}]
});
