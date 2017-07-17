const jsonApi = require("../../.");
const MongoStore = require("../../../jsonapi-store-mongodb");
//var rppHandler = require("../handlers/rppHandler.js");
const REGEX_NAME_STRING = /^[A-Z|a-z0-9_%][^\s*\\?;{}[\]|`'"]*$/gi;
const REGEX_VALUE_TYPE = /(^bool$)|(^real$)|(^integer$)|(^string$)$/gi;
const REGEX_INPUT_TYPE = /(^one_shot$)|(^force$)|(^momentary$)$/gi;

jsonApi.define({
  namespace: "json:api",
  resource: "tags",
  description: "Represents a tag.",
  handlers: new MongoStore({
    url: process.env.MONGO_URL
  }),
  searchParams: {},
  attributes: {
    id: jsonApi.Joi.string().default(jsonApi.Joi.ref('_id')),
    _id: jsonApi.Joi.string(),
    objName: jsonApi.Joi.string().trim().regex(REGEX_NAME_STRING)
      .description("The unique tag name.")
      .example("MY_AWESOME_TAGNAME"),
    input: jsonApi.Joi.any().optional()
      .description("If tag is writeable, the value to write to the tag in engineering units.")
      .example("24.5"),
    memLocation: jsonApi.Joi.string().required()
      .description("PLC memory location.")
      .example("N21:0 or 40001 for modbus driver"),
    value: jsonApi.Joi.any().optional()
      .description("The current value of the tag in engineering units.")
      .example("24.5"),
    rawValue: jsonApi.Joi.number().integer().optional()
      .description("The current value of the tag in engineering units.")
      .example("24"),
    valueType: jsonApi.Joi.string().trim().regex(REGEX_VALUE_TYPE)
      .default('real')
      .description('Can only be bool, real, integer or string.')
      .example('bool'),
    dataQuality: jsonApi.Joi.string().optional()
      .description("The data quality of the value of this tag.")
      .example("Ok"),
    isWritable: jsonApi.Joi.boolean().default(false)
      .description("Can you write to this tag.")
      .example("FALSE"),
    lastUpdate: jsonApi.Joi.date().optional()
      .description("The last time the current value was updated in UNIX time (ms).")
      .example("1463776147123"),
    isHistorical: jsonApi.Joi.boolean().default(true)
      .description("Should we store historical data for this tag.")
      .example("TRUE"),
    histDeadbandPercent: jsonApi.Joi.number().default(.03)
      .description("The percent of change of value field required to trigger a history sample where .03 is 3%. 0 means collect everything.")
      .example(".03"),
    rawMin: jsonApi.Joi.number().default(0)
      .description("The minimum raw integer value that the PLC will return for this tag.")
      .example(0),
    rawMax: jsonApi.Joi.number().min(jsonApi.Joi.ref('rawMin')).required()
      .description("The maximum raw integer value that the PLC will return for this tag."),
    engMin: jsonApi.Joi.number().required()
      .description("The minimum eng units value that corresponds to the rawMin value.")
      .example(0),
    engMax: jsonApi.Joi.number().min(jsonApi.Joi.ref('engMin')).required()
      .description("The maximum eng units value that corresponds to the rawMax value."),
    desc: jsonApi.Joi.string().required()
      .description("The tag description.")
      .example("Volts from TrendPoint."),
    units: jsonApi.Joi.string().required()
      .description("The tag units.")
      .example("Volts"),
    inputType: jsonApi.Joi.string().trim().lowercase().regex(REGEX_INPUT_TYPE).optional()
      .description("Only valid for writable tags. one_shot = write the value one time. force = " +
        "always do a write if the tag.value is not equal to tag.input. momentary = write a 1 and" +
        "then write a 0.")
      .example("one_shot"),
    trackRuntime: jsonApi.Joi.boolean().default(false)
      .description("If true, then count the number of times this tag goes non-zero and track the " +
        "amount of time the tag stays non zero.")
      .example("true"),
    alarmStatus: jsonApi.Joi.string().optional()
      .description("Is the activeAlarm clear, acked, unacked.")
      .example("Clear, acked, unacked"),
    activeAlarm: jsonApi.Joi.string().optional()
      .description("Is the tag in an alarm state based on an alarmDefs definition for the tag.")
      .example("None, HH, HI, LO, LL, INVALID, EQUAL, NOT_EQUAL"),
    alarmAcked: jsonApi.Joi.boolean().default(false)
      .description("If true the alarm has been acked.")
      .example("true"),
    alarmReset: jsonApi.Joi.boolean().default(false)
      .description("If true the alarm has been reset.")
      .example("true"),
    alarmDefId: jsonApi.Joi.allow(null, '').optional()
      .description("If in alarm, then this will point to the alarm def id."),
    device_id: jsonApi.Joi.allow(null, '').optional()
      .description("The device id that this tag is associated with.")
      .example("d7a8b614-701d-41f5-b1c6-6b06790b0767")
  },
  examples: [{}]
});
