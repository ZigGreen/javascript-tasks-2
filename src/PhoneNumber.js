export default class PhoneNumber {
    static parse(numberString, defaultCountryCode) {

        numberString = numberString
            .replace(/\s/g, '')
            .replace(/(\d)-(\d)/g, '$1$2')
            .replace(/(\d)-(\d)/g, '$1$2');
        const localNumber = numberString.slice(-7);
        const regionCode = numberString.slice(0, -7).replace(/\((\d{3})\)$/, '$1');
        const operatorCode = regionCode.slice(-3);
        let countryCode = regionCode.slice(0, -3).replace(/^\+(\d)/g, '$1');
        countryCode = Number(countryCode || defaultCountryCode);
        return new PhoneNumber([countryCode, operatorCode, localNumber].join(''));

    }

    constructor(number) {
        this._intNumber = Number(number);
    }

    get isValid() {
        return !Number.isNaN(this._intNumber);
    }

    toString() {
        return this._intNumber;
    }
}
