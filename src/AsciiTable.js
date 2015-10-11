export const DEFAULT_TABLE_STYLE = {
    topLeftBorder: '┌',
    topRightBorder: '┐',
    topMiddleBorder: '┬',
    horizontalBorder: '─',
    verticalBorder: '|',
    bottomLeftBorder: '└',
    bottomRightBorder: '┘',
    bottomMiddleBorder: '┴',
    middleLeftBorder: '├',
    middleRightBorder: '┤',
    middleMiddleBorder: '┼',
    space: ' '
};


export default class AsciiTable {
    constructor({headers=[], style}) {
        style = {...DEFAULT_TABLE_STYLE, ...style};
        const styles = {
            topBorderStyle: makeStyle(
                style.topLeftBorder,
                style.topRightBorder,
                style.topMiddleBorder,
                style.horizontalBorder
            ),
            contentLineStyle: makeStyle(
                style.verticalBorder,
                style.verticalBorder,
                style.verticalBorder,
                style.space
            ),
            bottomBorderStyle: makeStyle(
                style.bottomLeftBorder,
                style.bottomRightBorder,
                style.bottomMiddleBorder,
                style.horizontalBorder
            ),
            middleBorderStyle: makeStyle(
                style.middleLeftBorder,
                style.middleRightBorder,
                style.middleMiddleBorder,
                style.horizontalBorder
            )

        };
        Object.assign(this, {headers, styles});

    }

    /**
     * render ascii
     * @param table
     * @returns {string}
     */
    render(table) {
        const columnWidths = getColumnWidths([this.headers, ...table]);
        const {
            topBorderStyle,
            contentLineStyle,
            bottomBorderStyle,
            middleBorderStyle
            } = this.styles;

        const rowStyles = {
            topBorderStyle,
            contentLineStyle,
            bottomBorderStyle: middleBorderStyle
        };

        // render top border
        const asciiTable = [
            renderBorder(columnWidths, table[0], topBorderStyle)
        ];

        if (this.headers.length) {
            asciiTable.push(...renderRow(columnWidths, this.headers, rowStyles));
        }

        for (let row of table) {
            asciiTable.push(...renderRow(columnWidths, row, rowStyles))
        }

        // pop last middle border
        asciiTable.pop();
        // push bottom border instead
        asciiTable.push(
            renderBorder(columnWidths, table[0], bottomBorderStyle)
        );


        return asciiTable.join('\n');
    }
}
/**
 * renders content with border next to
 * @param columnWidths
 * @param content
 * @param style
 * @returns {string[]} [content, bottom border]
 */
function renderRow(columnWidths, content, style) {
    const {contentLineStyle, bottomBorderStyle} = style;
    return [
        renderLine(columnWidths, content, contentLineStyle),
        renderBorder(columnWidths, content, bottomBorderStyle)
    ];
}

/**
 * handy shortcut
 * @returns {{left: string, right: string, middle: string, space: string}}
 */
function makeStyle(left, right, middle, space) {
    return {left, right, middle, space};
}

/**
 * render table line
 * @param columnWidths {number[]}
 * @param content {string[]} content of the line
 * @param style {{left, right, middle, space}} corner & space style
 * @returns {string} rendered line
 */
function renderLine(columnWidths, content, style) {
    const {left, right, middle, space} = style;
    const line = [left];
    columnWidths.forEach((width, i) => {
        const contentItem = String(content[i] !== undefined ? content[i] : '');
        const contentLength = contentItem.length;
        contentLength && line.push(contentItem);
        line.push(...new Array(width - contentLength).fill(space));
        // do not render separator in case of empty content
        line.push(content[i] !== undefined ? middle : space);
    });

    // replace separator with right corner
    line.pop();
    line.push(right);

    return line.join('');

}

/**
 * render table border
 * @param columnWidths
 * @param content content below the border
 * @param style {{left, right, middle, space}} corner & space style
 * @returns {string}
 */
function renderBorder(columnWidths, content, style) {
    content = content.map(value => (
        new Array(String(value).length).fill(style.space).join('')
    ));
    return renderLine(columnWidths, content, style);
}

/**
 * compute columns size according table content
 * @param table {*[][]} corresponding table
 * @returns {number[]}
 */
function getColumnWidths(table) {
    const columnWidths = [];
    for (let row of table) {
        row.forEach((value, i) => (
            columnWidths[i] = Math.max(columnWidths[i] || 0, String(value).length)
        ));
    }
    return columnWidths;
}
