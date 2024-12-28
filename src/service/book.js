import {deleteRequest, getRequest, postRequest} from "./common";
import {BACK_END_URL} from "../utils/backend_url";

export async function getBookById(id){
    try{
        const response = await getRequest(BACK_END_URL.GET_BOOK_BY_ID,{id:id});

        if (response.status === "success")
            return response.data;
        else
            return null;
    } catch(e){
        return null;
    }
}

export async function getBookByIds(ids){
    try{
        const response = await getRequest(BACK_END_URL.GET_BOOK_BY_IDS,{ids:ids});

        if (response.status === "success")
            return response.data;
        else
            return null;
    } catch(e){
        return null;
    }
}




export async function getBooksPageable(page,element_num){
    try {
        const response = await getRequest(BACK_END_URL.GET_BOOK_PAGEABLE, {page: page, element_num: element_num});

        if (response.status=="success"){
            return response.data;
        }
        else {
            throw new Error("get books failed");
        }
    }
    catch(e){
        return [];
    }
}

export async function addBookToCart(cart_id,book_id){
    try {
        const response = await postRequest(BACK_END_URL.BOOK_ADD_TO_CART,
            {
                cart_id:cart_id,
                book_id:book_id
            }
        );
        if (response.status ==="success")
            return true;
        else
            return false;
    }
    catch (e){
        return false;
    }
}

export async function updateBook(book){
    try {
        const response = await postRequest(BACK_END_URL.UPDATE_BOOK,book);
        if (response.status ==="success")
            return true;
        else
            return false;
    }
    catch (e){
        return false;
    }
}

export async function getBookFilteredByTitle(title,page,element_num){
    try {
        const response = await getRequest(BACK_END_URL.GET_BOOK_FILTERED_BY_TITLE, {book_title:title,page_index:page,page_size:element_num});

        if (response.status=="success"){
            return response.data;
        }
        else {
            throw new Error("get books failed");
        }
    }
    catch(e){
        return [];
    }
//     const query = `
//     query SearchBook($keyword: String!, $page_index: Int!, $page_size: Int!) {
//   searchBookByNameGraphQL(keyword: $keyword, page_index: $page_index, page_size: $page_size) {
//     books {
//       id
//       title
//       author
//       ISBN
//       publisher
//       price
//       stock
//       cover++++++
//       sale
//     }
//     total_elements
//     total_pages
//   }
// }
//     `;
//
//     const variables = {
//         keyword: title,        // 搜索书籍的标题
//         page_index: page,      // 页码
//         page_size: element_num // 每页元素数
//     };
//
//     try {
//         const response = await postRequest(BACK_END_URL.GRAPHQL, {query, variables})
//
//         return response.data.searchBookByNameGraphQL;
//     } catch (e) {
//         console.error(e);
//         return [];
//     }

}

export async function deleteBook(book_id){
    try {
        const response = await deleteRequest(BACK_END_URL.DELETE_BOOK,{id:book_id});
        if (response.status ==="success")
            return true;
        else
            return false;
    }
    catch (e){
        return false;
    }
}

export async function createBook(book){
    try{
        const response = await postRequest(BACK_END_URL.CREATE_BOOK,book);
        if (response.status === "success")
            return true;
        else
            return false;
    }catch(e){
        return false;
    }
}

export async function searchAuthorByBookName(book){
    try{
        const response = await getRequest(BACK_END_URL.SEARCH_AUTHOR,{book:book});

        return response;
    }catch(e){
        return [];
    }
}

export async function searchTagsByTagName(tagName){
    try{
        const response = await getRequest(BACK_END_URL.SEARCH_TAG,{tagName:tagName});

        if (response.status === "success")
            return response.data;
        else
            return [];

    } catch (e){
        return [];
    }
}

export async function searchRelatedBooks(tagId){
    try{
        const response = await getRequest(BACK_END_URL.SEARCH_RELATE_BOOKS,{tagId:tagId});

        if (response.status === "success")
            return response.data;
        else
            return [];
    } catch (e){
        return [];
    }
}