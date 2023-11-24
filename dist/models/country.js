"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _database = require("../utils/database");

var Schema = _database.mongoose.Schema;
var CountrySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  alpha2Code: {
    type: String
  },
  alpha3Code: {
    type: String
  },
  capital: {
    type: String
  },
  region: {
    type: String
  },
  subregion: {
    type: String
  },
  population: {
    type: Number
  },
  demonym: {
    type: String
  },
  area: {
    type: Number
  },
  gini: {
    type: Number
  },
  nativeName: {
    type: String
  },
  numericCode: {
    type: String
  },
  flag: {
    type: String
  },
  cioc: {
    type: String
  },
  translations: {
    en: {
      type: String
    },
    de: {
      type: String
    },
    es: {
      type: String
    },
    fr: {
      type: String
    },
    ja: {
      type: String
    },
    it: {
      type: String
    },
    br: {
      type: String
    },
    pt: {
      type: String
    },
    nl: {
      type: String
    },
    hr: {
      type: String
    },
    fa: {
      type: String
    }
  },
  currencies: [{
    code: {
      type: String
    },
    name: {
      type: String
    },
    symbol: {
      type: String
    },
    position: {
      type: String,
      "default": 'right'
    }
  }],
  languages: [{
    iso639_1: {
      type: String
    },
    iso639_2: {
      type: String
    },
    name: {
      type: String
    },
    nativeName: {
      type: String
    }
  }],
  latlng: [],
  borders: [],
  timezones: [],
  callingCodes: [],
  altSpellings: [],
  regionalBlocs: [{
    acronym: {
      type: String
    },
    name: {
      type: String
    },
    otherAcronyms: [],
    otherNames: []
  }],
  states: [{
    name: {
      type: String
    }
  }],
  topLevelDomain: []
}, {
  versionKey: false
});

var Country = _database.mongoose.model('Country', CountrySchema);

var _default = Country;
exports["default"] = _default;