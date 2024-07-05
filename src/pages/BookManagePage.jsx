import BasicLayout from "../component/BasicLayout";
import BookManageTable from "../component/BookManageTable";

export default function BookManagePage(){
    return (
        <>
            <BasicLayout defaultKey={"book-manage"}>
                <BookManageTable/>
            </BasicLayout>
        </>
    )
}