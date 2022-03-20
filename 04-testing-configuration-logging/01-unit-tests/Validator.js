const validTypes = {
  string: 'string',
  number: 'number',
};
module.exports = class Validator {
  constructor(rules) {
    this.rules = rules;
  }

  validate(obj) {
    const errors = [];

    for (const field of Object.keys(this.rules)) {
      const rules = this.rules[field];

      const value = obj[field];
      const typeValue = typeof value;

      switch (rules.type) {
        case validTypes.string:
          if (typeValue !== validTypes.string) {
            errors.push({field, error: `expect string, got ${typeValue}`});
            return errors;
          }

          if (value.length < rules.min) {
            errors.push({field, error: `too short, expect ${rules.min}, got ${value.length}`});
          }
          if (value.length > rules.max) {
            errors.push({field, error: `too long, expect ${rules.max}, got ${value.length}`});
          }
          break;
        case validTypes.number:
          if (typeValue !== validTypes.number) {
            errors.push({field, error: `expect number, got ${typeValue}`});
            return errors;
          }

          if (value < rules.min) {
            errors.push({field, error: `too little, expect ${rules.min}, got ${value}`});
          }
          if (value > rules.max) {
            errors.push({field, error: `too big, expect ${rules.max}, got ${value}`});
          }
          break;
        default:
          errors.push({field, error: `Unexpected type: ${rules.type}`});
          break;
      }
    }

    return errors;
  }
};
