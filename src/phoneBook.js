import { readFileSync } from 'fs';
import PhoneNumber from './PhoneNumber';
import AsciiTable from './AsciiTable';
import 'babel/polyfill';

let phoneBook = []; // Здесь вы храните записи как хотите

const validEmailRegEx = /^[-\w.]+@([А-яA-z0-9][-А-яA-z0-9]+\.)+[А-яA-z]{2,4}$/;

/*
 Функция добавления записи в телефонную книгу.
 На вход может прийти что угодно, будьте осторожны.
 */
export function add(name, phone, email) {
    const phoneNumber = PhoneNumber.parse(phone, '7');

    const isPhoneValid = phoneNumber.isValid;
    const isEmailValid = validEmailRegEx.test(email);

    if (!isPhoneValid || !isEmailValid) {
        console.warn(`Неверный формат для контакта: ${name} ${phone} ${email}`);
        return false;
    }
    //TODO: задетектить дубликаты
    phoneBook.push({name, phoneNumber, email});

}

function matchRecordByQuery(record, query) {

    //TODO: написать коменты
    return Object.keys(record)
        .map(key => record[key])
        .map(value => Boolean(String(value).indexOf(query) + 1))
        .reduce((mem, v) => mem + v, 0);
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

function recordToArray({name, phoneNumber, email}) {
    return [name, phoneNumber, email];
}
/*
 Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
 */
export function showTable(filename) {
    const table = new AsciiTable({headers: ['name', 'phone', 'email']});
    console.log(table.render(phoneBook.map(recordToArray)));
    // Ваша чёрная магия здесь

}
