import {Card, Form, Input} from "antd";
import {useEffect} from "react";

export default function BookEditForm({book}) {
    useEffect(() => {
        console.log("book", book);
    }, []);
    return (
        <div style={{marginTop:"20px"}}>
            <Form>
                <Form.Item label={"书名"} name={"name"} initialValue={book.name}>
                    <Input/>
                </Form.Item>
                <Form.Item label={"作者"} name={"author"} initialValue={book.author}>
                    <Input/>
                </Form.Item>
                <Form.Item label={"价格"} name={"price"} initialValue={book.price}>
                    <Input/>
                </Form.Item>
                <Form.Item label={"库存"} name={"stock"} initialValue={book.stock}>
                    <Input/>
                </Form.Item>
                <Form.Item label={"简介"} name={"description"} initialValue={book.description}>
                    <Input.TextArea/>
                </Form.Item>

            </Form>
        </div>
    );
}