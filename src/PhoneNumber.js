export default class PhoneNumber {

    /**
     * parse phone number string
     * @param numberString
     * @param defaultCountryCode
     * @returns {PhoneNumber}
     */
    static parse(numberString, defaultCountryCode) {

        numberString = numberString
            .replace(/\s/g, '')
            .replace(/(\d)-(\d)/g, '$1$2')
            .replace(/(\d)-(\d)/g, '$1$2');
        // number format:
        // + [ region code: [country code: {any}] [operator code: {3}] ]
        // [local number: {7}]
        const localNumber = numberString.slice(-7);
        const regionCode = numberString
            .slice(0, -7)
            // brackets wrap only in region code
            .replace(/\((\d{3})\)$/, '$1');

        const operatorCode = regionCode.slice(-3);

        let countryCode = regionCode.slice(0, -3).replace(/^\+(\d)/g, '$1');
        countryCode = Number(countryCode || defaultCountryCode);

        return new PhoneNumber([countryCode, operatorCode, localNumber].join(''));

    }

    static format(number) {
        const [,
            countryCode,
            operatorCode,
            localNumber
            ] = String(number).match(/(\d{1,})(\d{3})(\d{7})$/);
        return `+${countryCode} (${operatorCode}) ${localNumber}`
    }

    constructor(number) {
        if (String(number).length < 10) {
            number = NaN;
        }
        this._intNumber = Number(number);

    }

    get isValid() {
        return !Number.isNaN(this._intNumber);
    }

    toString() {
        return this.isValid ?
            PhoneNumber.format(this._intNumber) : '[invalid number]';
    }
}
