import React from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

const TodoItem = ({ itemList, onDelete, handleToggleComplete }) => {
  let i = 0;
  let num = () => {
    i++;
    return i;
  };

  return (
    <div className="row mt-5">
      <div className="col-12 d-flex">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>ToDo Name</th>
              <th>Should Complete On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemList?.length > 0 ? (
              itemList.map((item) => (
                <tr key={item._id}>
                  <td className="align-middle">{num()}</td>
                  <td
                    className={
                      item.completed
                        ? "align-middle text-success"
                        : "align-middle"
                    }
                  >
                    {item.completed ? <s>{item.todoName}</s> : item.todoName}
                  </td>
                  <td
                    className={
                      item.completed
                        ? `align-middle text-success font-weight-bold`
                        : "align-middle"
                    }
                  >
                    {item.completed ? `${item.date} (Completed)` : item.date}
                  </td>
                  <td className="align-middle">
                    <Button
                      variant="success"
                      onClick={() =>
                        handleToggleComplete(item._id, !item.completed)
                      }
                    >
                      {item.completed ? "Unmark" : "Mark Complete"}
                    </Button>{" "}
                    <Button variant="danger" onClick={() => onDelete(item._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No ToDo List
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TodoItem;
