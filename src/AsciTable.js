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


export default class AsciTable {
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

    render(arrayTable) {
        const columnWidths = getColumnWidths([this.headers, ...arrayTable]);
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

        const table = [
            renderBorder(columnWidths, arrayTable[0], topBorderStyle)
        ];

        if (this.headers.length) {
            table.push(...renderRow(columnWidths, this.headers, rowStyles));
        }

        arrayTable.forEach(row => (
            table.push(...renderRow(columnWidths, row, rowStyles))
        ));

        table.pop();
        table.push(
            renderBorder(columnWidths, arrayTable[0], bottomBorderStyle)
        );


        return table.join('\n');
    }
}

function renderRow(columnWidths, content, style) {
    const {contentLineStyle, bottomBorderStyle} = style;
    return [
        renderLine(columnWidths, content, contentLineStyle),
        renderBorder(columnWidths, content, bottomBorderStyle)
    ];
}

function makeStyle(left, right, middle, space) {
    return {left, right, middle, space};
}

function renderLine(columnWidths, content, style) {
    const {left, right, middle, space} = style;
    const line = [left];
    columnWidths.forEach((width, i) => {
        const contentItem = String(content[i] !== undefined ? content[i] : '');
        const contentLength = contentItem.length;
        contentLength && line.push(contentItem);
        line.push(...new Array(width - contentLength).fill(space));
        line.push(content[i] !== undefined ? middle : space);
    });

    line.pop();
    line.push(right);
    return line.join('');

}

function renderBorder(columnWidths, content, style) {
    content = content.map(value => (
        new Array(String(value).length).fill(style.space).join('')
    ));
    return renderLine(columnWidths, content, style);
}

function getColumnWidths(arrayTable) {
    const columnWidths = [];
    for (let row of arrayTable) {
        row.forEach((value, i) => (
            columnWidths[i] = Math.max(columnWidths[i] || 0, String(value).length)
        ));
    }
    return columnWidths;
}
