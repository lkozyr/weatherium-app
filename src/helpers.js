
/**
 * Converts number of seconds to string date format.
 * @param {Number} seconds - Date represented by a number of seconds. Example: 1530527400
 * @param {boolean} keepComma - whether date should be delimited from the weekday with comma. Default value: true.
 * @param {string} locale - locale to use for data formatting. Default value: 'en-US'.
 * @returns {string} dateString - date converted to string. Example: 'Monday, Jul 10'.
 */
export const getDateString = (seconds, keepComma = true, locale = 'en-US') => {
    const date = new Date(seconds*1000);
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    const dateString = keepComma
                        ?  date.toLocaleDateString(locale, options)
                        :  date.toLocaleDateString(locale, options).replace(',', '\n');
    return dateString;
}