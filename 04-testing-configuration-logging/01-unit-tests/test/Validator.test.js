const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('Валидатор проверяет строковые поля', () => {
      it('Короткая строка', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'Lalala',
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too short, expect 10, got 6');
      });

      it('Валидная строка', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'Lalalalala',
        });
        expect(errors).to.have.length(0);

        const lowerBorderErrors = validator.validate({
          name: 'Lalalalala',
        });
        expect(lowerBorderErrors).to.have.length(0);

        const upperBorderErrors = validator.validate({
          name: 'LalalalalaLalalalala',
        });
        expect(upperBorderErrors).to.have.length(0);
      });

      it('Длинная строка', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'LalalalalaLalalalalaLalalalala',
        });
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too long, expect 20, got 30');
      });

      it('Строка существует', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({});
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('expect string, got undefined');
      });
    });

    describe('Валидатор проверяет числовые поля', () => {
      it('Слишком маленькое число', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          age: 6,
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too little, expect 10, got 6');
      });

      it('Валидное число', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          age: 11,
        });
        expect(errors).to.have.length(0);

        const lowerBorderErrors = validator.validate({
          age: 10,
        });
        expect(lowerBorderErrors).to.have.length(0);

        const upperBorderErrors = validator.validate({
          age: 20,
        });
        expect(upperBorderErrors).to.have.length(0);
      });

      it('Слишком большое число', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          age: 30,
        });
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too big, expect 20, got 30');
      });

      it('Число существует', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({});
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('expect number, got undefined');
      });
    });

    describe('Валидатор проверяет мульти поля', () => {
      it('Две ошибки', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'Lalala',
          age: 3,
        });

        expect(errors).to.have.length(2);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too short, expect 10, got 6');

        expect(errors[1]).to.have.property('field').and.to.be.equal('age');
        expect(errors[1]).to.have.property('error')
            .and.to.be.equal('too little, expect 10, got 3');
      });

      it('Ошибка в числе', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'Lalalalala',
          age: 3,
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too little, expect 10, got 3');
      });

      it('Ошибка в строке', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'Lala',
          age: 11,
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('too short, expect 10, got 4');
      });

      it('Пропущено значение', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        const errors = validator.validate({
          name: 'Lalalalala',
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('expect number, got undefined');
      });
    });


    describe('Общая валидация', () => {
      it('Неизвестное поле', () => {
        const validator = new Validator({
          birthday: {
            type: 'date',
            min: '19.03.1900',
            max: '19.03.2022',
          },
        });

        const errors = validator.validate({
          birthday: '14.02.1998',
        });

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('birthday');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('Unexpected type: date');
      });
    });
  });
});
