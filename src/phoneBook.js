import { readFileSync } from 'fs';

let phoneBook = []; // Здесь вы храните записи как хотите


class PhoneNumber {
    static parse(numberString,defaultCountryCode) {

        numberString = numberString
            .replace(/\s/g, '')
            .replace(/(\d)-(\d)/g,'$1$2')
            .replace(/(\d)-(\d)/g,'$1$2');
        const localNumber = numberString.slice(-7);
        const regionCode = numberString.slice(0,-7).replace(/\((\d{3})\)$/, '$1');
        const operatorCode = regionCode.slice(-3);
        let countryCode = regionCode.slice(0,-3).replace(/^\+(\d)/g, '$1');
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
      return this._intNumber
    }
}


const validEmailRegEx = /^[-\w.]+@([А-яA-z0-9][-А-яA-z0-9]+\.)+[А-яA-z]{2,4}$/;


/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
export function add(name, phone, email) {
    const phoneNumber = PhoneNumber.parse(phone, '7')

    const isPhoneValid = phoneNumber.isValid;
    const isEmailValide = validEmailRegEx.test(email);

    if (!isPhoneValid || !isEmailValide) {
        console.warn(`Неверный формат для контакта ${name} ${phone} ${email}`);
        return false;
    }
    //TODO: задетектить дубликаты
    phoneBook.push({name, phoneNumber, email});

}

function matchRecordByQuery(record, query) {
    //TODO: написать коменты
    return Object.keys(record)
            .map(key => record[key])
            .map(value => Boolean(String(value).indexOf(query)+1))
            .reduce((mem,v) => mem + v, 0);
}

function recordToString(record) {
    return Object.keys(record)
        .map(key => record[key])
        .join(', ');
}

/*
   Функция поиска записи в телефонную книгу.
   Поиск ведется по всем полям.
*/
export function find(query) {

    phoneBook
        .filter(record => matchRecordByQuery(record, query))
        .map(recordToString)
        .forEach(recordString => console.log(recordString));

}

/*
   Функция удаления записи в телефонной книге.
*/
export function remove(query) {
    phoneBook = phoneBook
        .filter(record => !matchRecordByQuery(record, query));

}

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
export function importFromCsv(filename) {
    var data = readFileSync(filename, 'utf-8');

}

function renderTable(arr, width, height) {
    return arr.map(recordToString)
        .reduce((mem, v) => mem + '\n' + v, '');
}
/*
   Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
*/
export function showTable(filename) {
    console.log(renderTable(phoneBook));
    // Ваша чёрная магия здесь

}
