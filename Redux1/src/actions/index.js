export function selectBook(book)
{
    //console.log('A Book has been selected : ', book.title);
    return{
        type : 'BOOK_SELECTED',
        payload: book
    };

}