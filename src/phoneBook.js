import { readFileSync } from 'fs';

let phoneBook = []; // Здесь вы храните записи как хотите

const validEmailRegEx = /^[-\w.]+@([А-яA-z0-9][-А-яA-z0-9]+\.)+[А-яA-z]{2,4}$/;
const validPhoneRegEx = /^((\+?\d{1,3})[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
/*
   Функция добавления записи в телефонную книгу.
   На вход может прийти что угодно, будьте осторожны.
*/
export function add(name, phone, email) {

    if (!validPhoneRegEx.test(phone) || !validEmailRegEx.test(email)) {
        console.warn(`Неверный формат для контакта ${name} ${phone} ${email}`);
        return false;
    }
    //TODO: задетектить дубликаты
    //TODO: приводить телефон к одному формату
    phoneBook.push({name, phone, email});

}

function matchRecordByQuery(record, query) {
    //TODO: написать коменты
    return Object
            .keys(record)
            .map(key => record[key])
            .map(value => Boolean(value.indexOf(query)+1))
            .reduce((mem,v) => mem + v, 0);
}

function recordToString(record) {
    return Object
        .keys(record)
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
    // Ваша удивительная магия здесь

}

/*
   Функция удаления записи в телефонной книге.
*/
export function remove(query) {
    phoneBook = phoneBook
        .filter(record => !matchRecordByQuery(record, query));
    // Ваша необьяснимая магия здесь

}

/*
   Функция импорта записей из файла (задача со звёздочкой!).
*/
export function importFromCsv(filename) {
    var data = readFileSync(filename, 'utf-8');

    // Ваша чёрная магия:
    // - Разбираете записи из `data`
    // - Добавляете каждую запись в книгу
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
