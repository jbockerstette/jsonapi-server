var jsonApi = require('../../.');
var MongoStore = require('../../../jsonapi-store-mongodb');
//var rppHandler = require("../handlers/rppHandler.js");
const REGEX_MAC_ADDRESS = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/i;
const REGEX_NAME_STRING = /^[A-Z|a-z0-9_%][^\s*\\?;{}[\]|`'"]*$/gi;

jsonApi.define({
  namespace: "json:api",
  resource: "hosts",
  description: "Represents device that has tags attached.",
  handlers: new MongoStore({
    url: process.env.MONGO_URL
  }),
  searchParams: {},
  attributes: {
    id: jsonApi.Joi.string().default(jsonApi.Joi.ref('_id')),
    _id: jsonApi.Joi.string(),
    objName: jsonApi.Joi.string().trim().regex(REGEX_NAME_STRING)
      .description("The unique host name.")
      .example("MyHost"),
    hostnameOrIP: jsonApi.Joi.string().trim().hostname().required()
      .description("The hostname or ip of the host which is running this scada software.")
      .example("my.cool.host.com"),
    isPrimary: jsonApi.Joi.boolean().default(true)
      .description("Is this the primary host.")
      .example("true"),
    macAddress: jsonApi.Joi.string().trim().uppercase().regex(REGEX_MAC_ADDRESS).optional()
      .description("The host mac address.")
      .example("00:00:00:00:00:00"),
    desc: jsonApi.Joi.string().required()
      .description("The description <Country>.<Location>.<Building>.<Floor>.<Room>.<Row>.<DP>.<PrimaryOrSec>")
      .example("US.MSC.01.01.0001.01.02.1"),
    dataQuality: jsonApi.Joi.string().optional()
      .description("The data quality of this host.")
      .example("Ok"),
    alarmStatus: jsonApi.Joi.string().optional()
      .description("Is the activeAlarm clear, acked, unacked.")
      .example("Clear, acked, unacked"),
    activeAlarm: jsonApi.Joi.string().optional()
      .description("Is the tag in an alarm state based on an alarmDefs definition for the tag.")
      .example("None, HH, HI, LO, LL, INVALID"),
    alarmAcked: jsonApi.Joi.boolean().default(false)
      .description("If true the alarm has been acked.")
      .example("true"),
    alarmReset: jsonApi.Joi.boolean().default(false)
      .description("If true the alarm has been reset.")
      .example("true"),
    alarmDefId: jsonApi.Joi.allow(null, '').optional()
      .description("If in alarm, then this will point to the alarm def id."),

  },
  examples: [{}]
});
